const stateMap = new WeakMap()

function getState(element) {
  return stateMap.get(element)
}

function getSuggestionWrapper(element) {
  return getState(element)?.wrapper || null
}

function hasVisibleSuggestionWrapper(element) {
  const wrapper = getSuggestionWrapper(element)

  return !!wrapper && wrapper.style.display !== "none"
}

function ensureSuggestionWrapper(element) {
  const state = getState(element)

  if (!state) {
    throw new Error("Autocomplete element is not initialized")
  }

  const wrapper = state.wrapper

  wrapper.classList.add("auto-complete-suggestion")
  wrapper.style.display = "unset"

  return wrapper
}

function hideSuggestionWrapper(element) {
  const state = getState(element)

  if (!state) return

  state.selectedIndex = -1

  const wrapper = state.wrapper

  wrapper.style.display = "none"
  wrapper.replaceChildren()
}

function getSuggestionWrapperTopPosition(element, wrapper) {
  const style = getComputedStyle(element)
  const elementRect = element.getBoundingClientRect()
  const suggestRect = wrapper.getBoundingClientRect()

  const outlineTrim =
    (parseInt(style.outlineOffset, 10) || 0) +
    (parseInt(style.outlineWidth, 10) || 0)

  if (element.offsetTop < suggestRect.height) {
    return element.offsetTop + elementRect.height + outlineTrim
  }

  if (elementRect.bottom + suggestRect.height > window.innerHeight) {
    return element.offsetTop - suggestRect.height - outlineTrim
  }

  return element.offsetTop + elementRect.height + outlineTrim
}

function trimSuggestionWrapperPosition(element) {
  const wrapper = getSuggestionWrapper(element)

  if (!wrapper) return

  const style = getComputedStyle(element)

  wrapper.style.marginLeft = style.marginLeft
  wrapper.style.marginRight = style.marginRight
  wrapper.style.width = `${element.offsetWidth}px`
  wrapper.style.top = `${getSuggestionWrapperTopPosition(element, wrapper)}px`
}

function extractSuggestKey(suggest) {
  return suggest?.key || suggest?.id || suggest?.url
}

function extractSuggestTitle(suggest) {
  return (
    suggest?.title ||
    suggest?.meta?.title ||
    extractSuggestKey(suggest) ||
    suggest
  )
}

/*
 * aria-selected is only a reflection of state.selectedIndex.
 *
 * It is never used to determine which suggestion is selected.
 */
function updateSelection(element) {
  const state = getState(element)

  if (!state) return

  const children = state.wrapper.children

  for (let index = 0; index < children.length; index++) {
    const item = children[index]

    if (index === state.selectedIndex) {
      item.setAttribute("aria-selected", "true")
    } else {
      item.removeAttribute("aria-selected")
    }
  }
}

function renderSuggestions({ element, suggestions = [], onSelect }) {
  const state = getState(element)

  if (!state) return

  /*
   * A completely new result set is being installed.
   *
   * Therefore an old selected index MUST NOT survive.
   */
  state.suggestions = suggestions
  state.selectedIndex = -1
  state.resultVersion++

  if (suggestions.length === 0) {
    hideSuggestionWrapper(element)
    return
  }

  const wrapper = ensureSuggestionWrapper(element)
  const fragment = document.createDocumentFragment()

  for (const suggestion of suggestions) {
    if (!suggestion) continue

    const item = document.createElement("li")
    const key = extractSuggestKey(suggestion)

    item.textContent = extractSuggestTitle(suggestion)

    if (key != null) {
      item.dataset.key = String(key)
    }

    /*
     * Keep the input focused while selecting with a mouse.
     */
    item.addEventListener("mousedown", (event) => {
      event.preventDefault()
    })

    item.addEventListener("click", () => {
      element.value = item.textContent
      hideSuggestionWrapper(element)
      element.focus()
      onSelect?.(suggestion)
    })

    fragment.appendChild(item)
  }

  /*
   * Replace the entire list at once.
   */
  wrapper.replaceChildren(fragment)

  /*
   * selectedIndex is -1, so this explicitly guarantees
   * that nothing in the new list is selected.
   */
  updateSelection(element)
  trimSuggestionWrapperPosition(element)
}

function getSelectedSuggestion(element) {
  const state = getState(element)

  if (!state) {
    return undefined
  }

  if (
    state.selectedIndex < 0 ||
    state.selectedIndex >= state.suggestions.length
  ) {
    return undefined
  }

  return state.suggestions[state.selectedIndex]
}

function moveSelection(element, direction) {
  const state = getState(element)

  if (!state) return

  if (!hasVisibleSuggestionWrapper(element)) {
    return
  }

  const count = state.wrapper.children.length

  if (count === 0) {
    state.selectedIndex = -1
    return
  }

  /*
   * Nothing is selected yet.
   */
  if (state.selectedIndex === -1) {
    state.selectedIndex = direction === "down" ? 0 : count - 1
  } else if (direction === "down") {
    state.selectedIndex = (state.selectedIndex + 1) % count
  } else {
    state.selectedIndex = (state.selectedIndex - 1 + count) % count
  }

  updateSelection(element)
}

function throttle(func, wait = 100) {
  let timeout = null
  let trailingArgs = null
  let trailingThis = null

  return function (...args) {
    if (timeout) {
      trailingArgs = args
      trailingThis = this
      return
    }

    func.apply(this, args)

    timeout = setTimeout(() => {
      timeout = null

      if (trailingArgs) {
        const args = trailingArgs
        const context = trailingThis

        trailingArgs = null
        trailingThis = null

        func.apply(context, args)
      }
    }, wait)
  }
}

/*
 * Debounced query manager.
 *
 * queryData must have this API:
 *
 *   async function queryData(value, signal) {
 *     return suggestions
 *   }
 *
 * It returns:
 *
 *   Promise<Array>
 */
function createSuggestionFetcher(queryData, wait = 100) {
  let timer = null
  let controller = null
  let requestVersion = 0
  let lastQuery = null

  function cancel() {
    clearTimeout(timer)
    timer = null

    controller?.abort()
    controller = null

    /*
     * Invalidate all outstanding requests.
     */
    requestVersion++

    /*
     * Important:
     * after cancelling, the same query must be allowed
     * to run again.
     */
    lastQuery = null
  }

  function query(value, callback) {
    value = value.trim()

    if (!value) {
      cancel()
      return
    }

    /*
     * Don't issue the same query twice.
     */
    if (value === lastQuery) {
      return
    }

    lastQuery = value

    clearTimeout(timer)

    timer = setTimeout(async () => {
      timer = null

      /*
       * Abort the previous request.
       */
      controller?.abort()

      controller = new AbortController()

      const currentVersion = ++requestVersion
      const signal = controller.signal

      try {
        const suggestions = await queryData(value, signal)

        /*
         * A newer request has already started.
         * Ignore this result completely.
         */
        if (currentVersion !== requestVersion) {
          return
        }

        callback(null, suggestions ?? [])
      } catch (error) {
        /*
         * Abort is expected.
         */
        if (error?.name === "AbortError") {
          return
        }

        /*
         * Ignore errors from stale requests too.
         */
        if (currentVersion !== requestVersion) {
          return
        }

        callback(error, [])
      }
    }, wait)
  }

  return {
    query,
    cancel
  }
}

function querySuggestions(element) {
  const state = getState(element)

  if (!state) return

  state.fetcher.query(element.value, (error, suggestions) => {
    const currentState = getState(element)

    if (!currentState) return

    if (error) {
      console.error(error)

      /*
       * Installing an empty result set also resets
       * selectedIndex.
       */
      renderSuggestions({
        element
      })

      return
    }

    /*
     * renderSuggestions() replaces both the data and
     * selection state atomically from our perspective.
     */
    renderSuggestions({
      element,
      suggestions,
      onSelect: currentState.onSelect
    })
  })
}

function handleKeyEvent({ element, event, threshold }) {
  const state = getState(element)

  if (!state) return

  const key = event.key

  /*
   * Escape:
   *
   * Close autocomplete if it is open.
   *
   * Do NOT call preventDefault().
   * Do NOT call stopPropagation().
   *
   * This allows a surrounding <dialog> to process Escape.
   */
  if (key === "Escape") {
    if (hasVisibleSuggestionWrapper(element)) {
      hideSuggestionWrapper(element)
    } else {
      state.fetcher.cancel()
    }

    return
  }

  /*
   * Arrow navigation is handled only during keydown.
   */
  if (event.type === "keydown" && (key === "ArrowDown" || key === "ArrowUp")) {
    if (hasVisibleSuggestionWrapper(element)) {
      moveSelection(element, key === "ArrowDown" ? "down" : "up")
    } else {
      querySuggestions(element)
    }

    return
  }

  /*
   * Enter selects the currently selected suggestion.
   */
  if (event.type === "keydown" && key === "Enter") {
    const selection = getSelectedSuggestion(element)

    if (selection !== undefined) {
      element.value = extractSuggestTitle(selection)

      hideSuggestionWrapper(element)

      element.focus()

      if (state.onSelect) {
        event.preventDefault()
        event.stopImmediatePropagation()

        state.onSelect(selection)
      }
    }

    return
  }

  /*
   * Everything below this point is for normal typing,
   * which is processed on keyup.
   */
  if (event.type !== "keyup") {
    return
  }

  /*
   * Don't search for navigation/control keys.
   */
  if (
    key === "ArrowDown" ||
    key === "ArrowUp" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Enter" ||
    key === "Escape" ||
    key === "Tab"
  ) {
    return
  }

  const value = element.value.trim()

  const meetsThreshold = !threshold || value.length >= threshold

  if (!meetsThreshold) {
    state.fetcher.cancel()

    renderSuggestions({
      element
    })

    return
  }

  querySuggestions(element)
}

function findSuggestionWrapper(element) {
  /*
   * First use the explicitly specified wrapper ID.
   */
  const wrapperId = element.getAttribute("suggestion-wrapper-id")

  if (wrapperId) {
    const wrapper = document.getElementById(wrapperId)

    if (wrapper) {
      return wrapper
    }
  }

  /*
   * Fall back to an adjacent UL.
   */
  const next = element.nextElementSibling

  if (next && next.tagName === "UL") {
    return next
  }

  return null
}

function prepareElement({ element, queryData, threshold, onSelect }) {
  /*
   * Don't initialize the same input twice.
   */
  if (stateMap.has(element)) {
    return
  }

  let wrapper = findSuggestionWrapper(element)

  /*
   * Only create the UL if there isn't already one.
   */
  if (!wrapper) {
    wrapper = document.createElement("ul")

    element.insertAdjacentElement("afterend", wrapper)
  }

  wrapper.classList.add("auto-complete-suggestion")

  wrapper.style.display = "none"

  const state = {
    wrapper,

    /*
     * The suggestions currently represented by the DOM.
     */
    suggestions: [],

    /*
     * -1 = nothing selected.
     *
     * This is the ONLY source of truth for selection.
     */
    selectedIndex: -1,

    /*
     * Incremented whenever a new result set is installed.
     */
    resultVersion: 0,

    fetcher: null,

    onSelect,

    reposition: null
  }

  state.fetcher = createSuggestionFetcher(queryData, 100)

  stateMap.set(element, state)

  element.addEventListener("blur", () => {
    state.fetcher.cancel()

    state.suggestions = []
    state.selectedIndex = -1

    hideSuggestionWrapper(element)
  })

  element.addEventListener("keydown", (event) => {
    handleKeyEvent({
      element,
      event,
      threshold
    })
  })

  element.addEventListener("keyup", (event) => {
    handleKeyEvent({
      element,
      event,
      threshold
    })
  })

  state.reposition = throttle(() => {
    if (hasVisibleSuggestionWrapper(element)) {
      trimSuggestionWrapperPosition(element)
    }
  })

  window.addEventListener("resize", state.reposition)

  window.addEventListener("scroll", state.reposition, {
    passive: true
  })
}

export function AutoComplete({ selector, queryData, threshold, onSelect }) {
  for (const element of document.querySelectorAll(selector)) {
    prepareElement({
      element,
      queryData,
      threshold,
      onSelect
    })
  }
}
