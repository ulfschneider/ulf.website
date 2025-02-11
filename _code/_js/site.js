//service worker
if (navigator.serviceWorker && "{{site.useServiceWorker}}" !== "false") {
  addEventListener("DOMContentLoaded", function () {
    navigator.serviceWorker.register("/serviceworker.js").catch((error) => {
      console.error(error);
    });
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        command: "trimCache",
      });
    }
  });
}

//javascript detector
addEventListener("DOMContentLoaded", () => {
  let noJs = document.querySelectorAll(".no-js");
  for (let element of noJs) {
    element.classList.remove("no-js");
    element.classList.add("js");
  }
});

function debounce(func, wait = 100, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function throttle(func, wait = 100) {
  let timeout;
  let trailing;
  return function () {
    let context = this,
      args = arguments;

    if (timeout) {
      trailing = true;
      return;
    }
    trailing = false;
    func.apply(context, args);

    let later = function () {
      timeout = null;
      if (trailing) {
        func.apply(context, args);
      }
    };

    timeout = setTimeout(later, wait);
  };
}

//back to top
function maintainBackToTop() {
  let backToTop = document.querySelector("#back-to-top");
  if (backToTop) {
    let windowHeight = window.innerHeight;
    let documentHeight = document.body.scrollHeight;
    let scrollY = window.scrollY;

    if (windowHeight * 1.5 < documentHeight && scrollY >= 0.5 * windowHeight) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  }
}

addEventListener("DOMContentLoaded", throttle(maintainBackToTop));
addEventListener("scroll", throttle(maintainBackToTop));
addEventListener("resize", throttle(maintainBackToTop));

//keyboard navigation
function registerKeyNav(key, path, focusSelector) {
  const registerKey =
    key + (path ? `.${path}` : "") + (focusSelector ? `.${focusSelector}` : "");
  if (key && (path || focusSelector) && !window["keynav." + registerKey]) {
    window["keynav." + registerKey] = true;

    addEventListener("keydown", (event) => {
      let focus = document.querySelector(":focus");
      if (
        focus &&
        "INPUT" == focus.tagName &&
        "submit" != focus.type &&
        "reset" != focus.type
      ) {
        return;
      } else if (focus && "TEXTAREA" == focus.tagName) {
        return;
      }

      if (event.key == key) {
        if (
          !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        ) {
          const url = new URL(location.href);
          if (path && url.pathname != path) {
            event.preventDefault();
            event.stopPropagation();
            location.href = path;
          } else if (focusSelector) {
            event.preventDefault();
            event.stopPropagation();
            const field = document.querySelector(focusSelector);
            if (field) {
              field.focus();
            }
          }
        }
      }
    });
  }
}
