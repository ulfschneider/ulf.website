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
        let suggestionWrapperId = element.getAttribute('suggestion-wrapper-id');
        return document.querySelector('#' + suggestionWrapperId);
    }

    function hasVisibleSuggestionWrapper(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        return suggestionWrapper && suggestionWrapper.style.display != 'none';
    }

    function ensureSuggestionWrapper(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        if (!suggestionWrapper) {
            suggestionWrapper = document.createElement('ul');
            suggestionWrapper.id = suggestionWrapperId;
            element.insertAdjacentElement('afterend', suggestionWrapper);
        }
        suggestionWrapper.classList.add('auto-complete-suggestion');
        suggestionWrapper.style.display = 'unset';
        return suggestionWrapper;
    }

    function isMarkedHidden(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        return suggestionWrapper && suggestionWrapper.getAttribute('mark-hidden') == 'true';
    }

    function unmarkHidden(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        if (suggestionWrapper) {
            suggestionWrapper.removeAttribute('mark-hidden');
        }
    }

    function markHidden(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        if (suggestionWrapper) {
            suggestionWrapper.setAttribute('mark-hidden', true);
        }
    }

    function hideSuggestionWrapper(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        if (suggestionWrapper) {
            markHidden(element);
            suggestionWrapper.style.display = 'none';
            suggestionWrapper.innerHTML = '';
        }
    }

    function getSuggestionWrapperTopPosition(element, suggestionWrapper) {
        let elementStyle = getComputedStyle(element);
        let elementRect = element.getBoundingClientRect();
        let suggestRect = suggestionWrapper.getBoundingClientRect();
        let outlineTrim = parseInt(elementStyle.outlineOffset) + parseInt(elementStyle.outlineWidth);

        if (element.offsetTop < suggestRect.height) {
            //there is not enough space at the top anyway
            //attach suggestions to the bottom of the input field
            return (element.offsetTop + elementRect.height + outlineTrim) + 'px';
        } else if (elementRect.bottom + suggestRect.height > window.innerHeight) {
            //there is not enough space to the bottom of the viewport
            //but there is enough space to the top of the document
            //attach suggestions to the top of the input field
            return (element.offsetTop - suggestRect.height - outlineTrim) + 'px';
        } else {
            //in any other case 
            //attach suggestions to the bottom of the input field
            return (element.offsetTop + elementRect.height + outlineTrim) + 'px';
        }
    }


    function trimSuggestionWrapperPosition(element) {
        let suggestionWrapper = getSuggestionWrapper(element);
        if (suggestionWrapper) {
            let elementStyle = getComputedStyle(element);

            suggestionWrapper.style.marginLeft = elementStyle.marginLeft;
            suggestionWrapper.style.marginRight = elementStyle.marginRight;
            suggestionWrapper.style.width = element.offsetWidth + 'px';

            suggestionWrapper.style.top = getSuggestionWrapperTopPosition(element, suggestionWrapper);
        }
    }

    function renderSuggestion({ element, keyUpEvent, suggestions = [], onSelect }) {
        if (isMarkedHidden(element)) {
            //this can only happen by callbacks returning after
            //the autosuggestion has been hidden
            return;
        } else if (suggestions.length == 0) {
            hideSuggestionWrapper(element);
        } else {
            let suggestionWrapper = ensureSuggestionWrapper(element);
            suggestionWrapper.innerHTML = '';
            trimSuggestionWrapperPosition(element);

            for (let suggest of suggestions) {
                if (suggest) {
                    let suggestElement = document.createElement('li');
                    suggestElement.innerText = suggest;

                    suggestElement.addEventListener('mousedown', function (event) {
                        //stop onblur for the element from firing when selecting 
                        //a suggestion with a pointing device
                        event.preventDefault();
                    });
                    suggestElement.addEventListener('click', function (event) {
                        element.value = event.target.innerText;
                        element.focus();
                        if (onSelect) {
                            onSelect();
                        }
                    })
                    suggestionWrapper.appendChild(suggestElement);
                    trimSuggestionWrapperPosition(element);
                }
            }

        }
    }

    function getSelectedSuggestion(element) {
        if (hasVisibleSuggestionWrapper(element)) {
            let suggestionWrapper = getSuggestionWrapper(element);
            let suggestions = [...suggestionWrapper.childNodes];
            for (let i = 0; i < suggestions.length; i++) {
                if (suggestions[i].getAttribute('aria-selected')) {
                    return suggestions[i].innerText;
                }
            }
        }
    }

    function indicateSuggestion(keyUpEvent) {
        if ((keyUpEvent.key == 'ArrowDown' || keyUpEvent.key == "ArrowUp")
            && hasVisibleSuggestionWrapper(keyUpEvent.target)) {
            let suggestionWrapper = getSuggestionWrapper(keyUpEvent.target);
            let suggestions = [...suggestionWrapper.childNodes];

            if (keyUpEvent.key == 'ArrowUp') {
                suggestions = suggestions.reverse();
            }

            let selectedIndex = -1;
            for (let i = 0; i < suggestions.length; i++) {
                if (suggestions[i].getAttribute('aria-selected')) {
                    selectedIndex = i;
                }
            }

            if (selectedIndex >= 0) {
                suggestions[selectedIndex].removeAttribute('aria-selected');
            }
            selectedIndex = ++selectedIndex % suggestions.length;
            suggestions[selectedIndex].setAttribute('aria-selected', true);
        }
    }

    function suggest({ element, keyUpEvent, data, threshold, onSelect }) {

        const callback = function (err, suggestions) {
            if (!err) {
                renderSuggestion({
                    element: element,
                    keyUpEvent: keyUpEvent,
                    suggestions: suggestions,
                    onSelect: onSelect
                });
                indicateSuggestion(keyUpEvent);
            } else {
                renderSuggestion({ element: element });
                console.log(err);
            }
        }

        let value = element.value;
        let trimmedValue = value.trim();
        unmarkHidden(element);
        if (!threshold || threshold > 0 && trimmedValue.length >= threshold) {
            if (keyUpEvent.key == 'ArrowUp' || keyUpEvent.key == 'ArrowDown' || keyUpEvent.key == 'ArrowLeft' || keyUpEvent.key == 'ArrowRight') {
                if (!hasVisibleSuggestionWrapper(element)) {
                    data(keyUpEvent, callback);
                } else {
                    indicateSuggestion(keyUpEvent)
                }
            } else if (keyUpEvent.key == 'Enter' && getSelectedSuggestion(element)) {
                element.value = getSelectedSuggestion(element);
                hideSuggestionWrapper(element);
                element.focus();
                if (onSelect) {
                    onSelect();
                }
            } else if (keyUpEvent.key == 'Enter' || keyUpEvent.key == 'Escape') {
                hideSuggestionWrapper(element);
            } else {
                data(keyUpEvent, callback);
            }
        } else {
            callback(null, []);
        }
    }


    function prepareElement({ element, data, threshold, onSelect }) {
        let suggestionWrapperId = element.getAttribute('suggestion-wrapper-id');

        if (!suggestionWrapperId) {
            do {
                idCounter++;
                suggestionWrapperId = 'autocomplete-' + idCounter;
            } while (document.querySelector('#' + suggestionWrapperId));
            element.setAttribute('suggestion-wrapper-id', suggestionWrapperId);
        }
        hideSuggestionWrapper(element);

        element.addEventListener('blur', function (event) {
            hideSuggestionWrapper(element);
        });
        element.addEventListener('keydown', function (event) {
            if (event.key == 'Enter' && getSelectedSuggestion(element)) {
                //do not submit a potentially existing form 
                //if we first have to use the selected suggestion
                event.preventDefault();
            }
        });
        element.addEventListener('keyup', function (event) {
            suggest({
                element: element,
                keyUpEvent: event,
                data: data,
                threshold: threshold,
                onSelect: onSelect
            })
        });
        addEventListener('resize', function () {
            //no throttle on resize
            trimSuggestionWrapperPosition(element);
        });
        addEventListener('scroll', function () {
            //throttle on scroll
            throttle(function () {
                trimSuggestionWrapperPosition(element);
            })
        });
    }

    return {
        init: function ({ selector, data, threshold, onSelect }) {
            let elements = document.querySelectorAll(selector);
            for (element of elements) {
                prepareElement({ element: element, data: data, threshold: threshold, onSelect: onSelect });
            }
        }
    }
})();