const wrapperMap = new WeakMap()

function getSuggestionWrapper(element) {
  return wrapperMap.get(element) || null
}

function hasVisibleSuggestionWrapper(element) {
  const wrapper = getSuggestionWrapper(element)
  return !!wrapper && wrapper.style.display !== "none"
}

function ensureSuggestionWrapper(element) {
  let wrapper = getSuggestionWrapper(element)

  if (!wrapper) {
    wrapper = document.createElement("ul")
    wrapper.className = "auto-complete-suggestion"
    element.insertAdjacentElement("afterend", wrapper)
    wrapperMap.set(element, wrapper)
  }

  wrapper.style.display = "unset"
  return wrapper
}

function hideSuggestionWrapper(element) {
  const wrapper = getSuggestionWrapper(element)

  if (!wrapper) return

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

function renderSuggestions({ element, suggestions = [], onSelect }) {
  if (suggestions.length === 0) {
    hideSuggestionWrapper(element)
    return
  }

  const wrapper = ensureSuggestionWrapper(element)

  // Build everything first. Don't force layout during the loop.
  const fragment = document.createDocumentFragment()

  for (const suggestion of suggestions) {
    if (!suggestion) continue

    const item = document.createElement("li")
    const key = extractSuggestKey(suggestion)

    item.textContent = extractSuggestTitle(suggestion)

    if (key) {
      item.dataset.key = key
    }

    item.addEventListener("mousedown", (event) => {
      // Prevent input blur when selecting a suggestion.
      event.preventDefault()
    })

    item.addEventListener("click", () => {
      element.value = item.textContent
      element.focus()
      hideSuggestionWrapper(element)

      onSelect?.(suggestion)
    })

    fragment.appendChild(item)
  }

  wrapper.replaceChildren(fragment)

  // Do this ONCE, after all DOM has been added.
  trimSuggestionWrapperPosition(element)
}

function getSelectedSuggestion(element, data) {
  const wrapper = getSuggestionWrapper(element)

  if (!wrapper || wrapper.style.display === "none") {
    return undefined
  }

  const selected = wrapper.querySelector("[aria-selected]")
  if (!selected) {
    return undefined
  }

  if (!data) {
    return selected.textContent
  }

  const key = selected.dataset.key

  if (key) {
    for (const entry of data) {
      if (key === extractSuggestKey(entry)) {
        return entry
      }
    }
  }

  return selected.textContent
}

function indicateSuggestion(event) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return
  }

  const element = event.target
  const wrapper = getSuggestionWrapper(element)

  if (!wrapper || wrapper.style.display === "none") {
    return
  }

  const suggestions = [...wrapper.children]

  if (suggestions.length === 0) {
    return
  }

  let selectedIndex = suggestions.findIndex((suggestion) =>
    suggestion.hasAttribute("aria-selected")
  )

  if (selectedIndex >= 0) {
    suggestions[selectedIndex].removeAttribute("aria-selected")
  }

  if (event.key === "ArrowUp") {
    selectedIndex--
  } else {
    selectedIndex++
  }

  selectedIndex = (selectedIndex + suggestions.length) % suggestions.length

  suggestions[selectedIndex].setAttribute("aria-selected", "true")
}

function throttle(func, wait = 100) {
  let timeout = null
  let trailingArgs = null

  return function (...args) {
    if (timeout) {
      trailingArgs = args
      return
    }

    func.apply(this, args)

    timeout = setTimeout(() => {
      timeout = null

      if (trailingArgs) {
        const args = trailingArgs
        trailingArgs = null
        func.apply(this, args)
      }
    }, wait)
  }
}

function debounce(func, wait = 100) {
  let timeout = null

  return function (...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

function suggest({ element, event, queryData, data, threshold, onSelect }) {
  const key = event.key

  const queryDataCallback = (err, suggestions = []) => {
    data.length = 0
    data.push(...suggestions)

    if (err) {
      renderSuggestions({ element })
      console.error(err)
      return
    }

    renderSuggestions({
      element,
      suggestions,
      onSelect
    })

    indicateSuggestion(event)
  }

  const value = element.value.trim()

  // Escape should only deal with the autocomplete.
  // Don't preventDefault(), so a surrounding <dialog> can
  // still handle Escape.
  if (key === "Escape") {
    if (hasVisibleSuggestionWrapper(element)) {
      hideSuggestionWrapper(element)
    }
    return
  }

  const meetsThreshold = !threshold || value.length >= threshold

  if (!meetsThreshold) {
    if (event.type === "keyup") {
      renderSuggestions({ element })
    }
    return
  }

  if (event.type === "keydown") {
    if (key === "ArrowDown" || key === "ArrowUp") {
      if (hasVisibleSuggestionWrapper(element)) {
        indicateSuggestion(event)
      } else {
        queryData(element.value, queryDataCallback)
      }

      return
    }

    if (key === "Enter") {
      const selection = getSelectedSuggestion(element, data)

      if (selection !== undefined) {
        element.value = extractSuggestTitle(selection)
        hideSuggestionWrapper(element)
        element.focus()

        if (onSelect) {
          event.preventDefault()
          event.stopImmediatePropagation()
          onSelect(selection)
        }
      }

      return
    }
  }

  if (event.type === "keyup") {
    queryData(element.value, queryDataCallback)
  }
}

function prepareElement({ element, queryData, data, threshold, onSelect }) {
  const query = debounce(queryData, 200)

  const wrapper = document.createElement("ul")
  wrapper.className = "auto-complete-suggestion"
  wrapper.style.display = "none"

  element.insertAdjacentElement("afterend", wrapper)
  wrapperMap.set(element, wrapper)

  element.addEventListener("blur", () => {
    hideSuggestionWrapper(element)
  })

  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && getSelectedSuggestion(element)) {
      event.preventDefault()
    }

    suggest({
      element,
      event,
      queryData: query,
      data,
      threshold,
      onSelect
    })
  })

  element.addEventListener("keyup", (event) => {
    suggest({
      element,
      event,
      queryData: query,
      data,
      threshold,
      onSelect
    })
  })

  const reposition = throttle(() => {
    if (hasVisibleSuggestionWrapper(element)) {
      trimSuggestionWrapperPosition(element)
    }
  })

  window.addEventListener("resize", reposition)
  window.addEventListener("scroll", reposition, { passive: true })
}

export function AutoComplete({ selector, queryData, threshold, onSelect }) {
  for (const element of document.querySelectorAll(selector)) {
    prepareElement({
      element,
      queryData,
      data: [],
      threshold,
      onSelect
    })
  }
}
