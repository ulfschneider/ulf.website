AutoComplete = (function () {
  let idCounter = 0;
  let throttleTimer;

  function throttle(callback, milliseconds = 100) {
    if (throttleTimer) return;

    throttleTimer = true;
    setTimeout(function () {
      callback();
      throttleTimer = false;
    }, milliseconds);
  }

  function getSuggestionWrapper(element) {
    let suggestionWrapperId = element.getAttribute("suggestion-wrapper-id");
    return document.querySelector("#" + suggestionWrapperId);
  }

  function hasVisibleSuggestionWrapper(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    return suggestionWrapper && suggestionWrapper.style.display != "none";
  }

  function ensureSuggestionWrapper(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    if (!suggestionWrapper) {
      suggestionWrapper = document.createElement("ul");
      suggestionWrapper.id = suggestionWrapperId;
      element.insertAdjacentElement("afterend", suggestionWrapper);
    }
    suggestionWrapper.classList.add("auto-complete-suggestion");
    suggestionWrapper.style.display = "unset";
    return suggestionWrapper;
  }

  function isMarkedHidden(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    return (
      suggestionWrapper &&
      suggestionWrapper.getAttribute("mark-hidden") == "true"
    );
  }

  function unmarkHidden(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    if (suggestionWrapper) {
      suggestionWrapper.removeAttribute("mark-hidden");
    }
  }

  function markHidden(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    if (suggestionWrapper) {
      suggestionWrapper.setAttribute("mark-hidden", true);
    }
  }

  function hideSuggestionWrapper(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    if (suggestionWrapper) {
      markHidden(element);
      suggestionWrapper.style.display = "none";
      suggestionWrapper.innerHTML = "";
    }
  }

  function getSuggestionWrapperTopPosition(element, suggestionWrapper) {
    let elementStyle = getComputedStyle(element);
    let elementRect = element.getBoundingClientRect();
    let suggestRect = suggestionWrapper.getBoundingClientRect();
    let outlineTrim =
      parseInt(elementStyle.outlineOffset) +
      parseInt(elementStyle.outlineWidth);

    if (element.offsetTop < suggestRect.height) {
      //there is not enough space at the top anyway
      //attach suggestions to the bottom of the input field
      return element.offsetTop + elementRect.height + outlineTrim + "px";
    } else if (elementRect.bottom + suggestRect.height > window.innerHeight) {
      //there is not enough space to the bottom of the viewport
      //but there is enough space to the top of the document
      //attach suggestions to the top of the input field
      return element.offsetTop - suggestRect.height - outlineTrim + "px";
    } else {
      //in any other case
      //attach suggestions to the bottom of the input field
      return element.offsetTop + elementRect.height + outlineTrim + "px";
    }
  }

  function trimSuggestionWrapperPosition(element) {
    let suggestionWrapper = getSuggestionWrapper(element);
    if (suggestionWrapper) {
      let elementStyle = getComputedStyle(element);

      suggestionWrapper.style.marginLeft = elementStyle.marginLeft;
      suggestionWrapper.style.marginRight = elementStyle.marginRight;
      suggestionWrapper.style.width = element.offsetWidth + "px";

      suggestionWrapper.style.top = getSuggestionWrapperTopPosition(
        element,
        suggestionWrapper
      );
    }
  }

  function extractSuggestTitle(suggest) {
    const key = extractSuggestKey(suggest);

    if (suggest.title) {
      return suggest.title;
    } else if (suggest.meta && suggest.meta.title) {
      return suggest.meta.title;
    } else if (key) {
      return key;
    }

    return suggest;
  }

  function extractSuggestKey(suggest) {
    return suggest.key || suggest.id || suggest.url;
  }

  function renderSuggestions({
    element,
    keyEvent,
    suggestions = [],
    onSelect,
  }) {
    if (isMarkedHidden(element)) {
      //this can only happen by callbacks returning after
      //the autosuggestion has been hidden
      return;
    } else if (suggestions.length == 0) {
      hideSuggestionWrapper(element);
    } else {
      let suggestionWrapper = ensureSuggestionWrapper(element);
      suggestionWrapper.innerHTML = "";
      trimSuggestionWrapperPosition(element);

      for (let suggest of suggestions) {
        if (suggest) {
          let suggestElement = document.createElement("li");
          suggestElement.innerText = extractSuggestTitle(suggest);
          const key = extractSuggestKey(suggest);
          if (key) {
            suggestElement.setAttribute("key", key);
          }

          suggestElement.addEventListener("mousedown", (event) => {
            //stop onblur for the element from firing when selecting
            //a suggestion with a pointing device
            event.preventDefault();
          });
          suggestElement.addEventListener("click", (event) => {
            element.value = event.target.innerText;
            element.focus();
            hideSuggestionWrapper(element);

            if (onSelect) {
              onSelect(suggest);
            }
          });
          suggestionWrapper.appendChild(suggestElement);
          trimSuggestionWrapperPosition(element);
        }
      }
    }
  }

  function getSelectedSuggestion(element, data) {
    if (hasVisibleSuggestionWrapper(element)) {
      let suggestionWrapper = getSuggestionWrapper(element);
      let suggestions = [...suggestionWrapper.childNodes];
      for (let i = 0; i < suggestions.length; i++) {
        if (suggestions[i].getAttribute("aria-selected")) {
          if (data) {
            //if the autocomplete data is more than just an array of
            //strings, try to return the original data entries
            const key = suggestions[i].getAttribute("key");
            if (key) {
              for (const entry of data) {
                if (key == extractSuggestKey(entry)) {
                  return entry;
                }
              }
            }
          }
          return suggestions[i].innerText;
        }
      }
    }
  }

  function indicateSuggestion(keyEvent) {
    if (
      (keyEvent.key == "ArrowDown" || keyEvent.key == "ArrowUp") &&
      hasVisibleSuggestionWrapper(keyEvent.target)
    ) {
      let suggestionWrapper = getSuggestionWrapper(keyEvent.target);
      let suggestions = [...suggestionWrapper.childNodes];

      if (keyEvent.key == "ArrowUp") {
        suggestions = suggestions.reverse();
      }

      let selectedIndex = -1;
      for (let i = 0; i < suggestions.length; i++) {
        if (suggestions[i].getAttribute("aria-selected")) {
          selectedIndex = i;
        }
      }

      if (selectedIndex >= 0) {
        suggestions[selectedIndex].removeAttribute("aria-selected");
      }
      selectedIndex = ++selectedIndex % suggestions.length;
      suggestions[selectedIndex].setAttribute("aria-selected", true);
    }
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function suggest({
    element,
    keyEvent,
    queryData,
    data,
    threshold,
    onSelect,
  }) {
    const queryDataCallback = function (err, suggestions) {
      data.length = 0; //this will clear the contents of the array, but keep the array!
      data.push(...suggestions);
      if (!err) {
        renderSuggestions({
          element: element,
          keyEvent: keyEvent,
          suggestions: suggestions,
          onSelect: onSelect,
        });
        indicateSuggestion(keyEvent);
      } else {
        renderSuggestions({ element: element });
        console.log(err);
      }
    };

    unmarkHidden(element);
    if (
      !threshold ||
      (threshold > 0 && element.value.trim().length >= threshold)
    ) {
      if (
        keyEvent.key == "ArrowUp" ||
        keyEvent.key == "ArrowDown" ||
        keyEvent.key == "ArrowLeft" ||
        keyEvent.key == "ArrowRight"
      ) {
        if (keyEvent.type == "keydown") {
          //use keydown event for arrow keys
          if (!hasVisibleSuggestionWrapper(element)) {
            queryData(element.value, queryDataCallback);
          } else {
            indicateSuggestion(keyEvent);
          }
        }
      } else if (keyEvent.key == "Enter" && getSelectedSuggestion(element)) {
        if (keyEvent.type == "keydown") {
          //use keydown event for Enter key
          const selection = getSelectedSuggestion(element, data);
          element.value = extractSuggestTitle(selection);
          hideSuggestionWrapper(element);
          element.focus();

          if (onSelect) {
            keyEvent.preventDefault();
            keyEvent.stopImmediatePropagation();
            onSelect(selection);
          }
        }
      } else if (keyEvent.key == "Enter" || keyEvent.key == "Escape") {
        if (keyEvent.type == "keydown") {
          //use keydown event for Enter and Escape keys
          if (keyEvent.key == "Escape") {
            keyEvent.preventDefault();
            keyEvent.stopImmediatePropagation();
          }
          hideSuggestionWrapper(element);
        }
      } else if (keyEvent.type == "keyup") {
        //use keyup event for everything else
        queryData(element.value, queryDataCallback);
      }
    } else if (keyEvent.type == "keyup") {
      queryDataCallback(null, []);
    }
  }

  function prepareElement({ element, queryData, data, threshold, onSelect }) {
    let suggestionWrapperId = element.getAttribute("suggestion-wrapper-id");

    if (!suggestionWrapperId) {
      do {
        idCounter++;
        suggestionWrapperId = "autocomplete-" + idCounter;
      } while (document.querySelector("#" + suggestionWrapperId));
      element.setAttribute("suggestion-wrapper-id", suggestionWrapperId);
    }
    hideSuggestionWrapper(element);

    element.addEventListener("blur", (event) => {
      hideSuggestionWrapper(element);
    });
    element.addEventListener("keydown", (event) => {
      if (event.key == "Enter" && getSelectedSuggestion(element)) {
        //do not submit a potentially existing form
        //if we first have to use the selected suggestion
        event.preventDefault();
      }
    });
    ["keyup", "keydown"].forEach((eventName) =>
      element.addEventListener(eventName, (event) => {
        suggest({
          element: element,
          keyEvent: event,
          queryData: queryData,
          data: data,
          threshold: threshold,
          onSelect: onSelect,
        });
      })
    );

    addEventListener("resize", function () {
      //no throttle on resize
      trimSuggestionWrapperPosition(element);
    });
    addEventListener("scroll", function () {
      //throttle on scroll
      throttle(function () {
        trimSuggestionWrapperPosition(element);
      });
    });
  }

  return {
    init: function ({ selector, queryData, threshold, onSelect }) {
      let elements = document.querySelectorAll(selector);
      for (element of elements) {
        prepareElement({
          element: element,
          queryData: debounce(queryData, 300),
          data: [],
          threshold: threshold,
          onSelect: onSelect,
        });
      }
    },
  };
})();
