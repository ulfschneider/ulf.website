/* Service Worker */
if (navigator.serviceWorker) {
  addEventListener("load", function () {
    navigator.serviceWorker.register("/serviceworker.js").catch((error) => {
      console.error(error);
    });
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ command: "trimCache" });
    }
  });
}

/* indicate if JavaScript is available */
function isJavaScript() {
  let noJs = document.querySelectorAll(".no-js");
  for (let element of noJs) {
    element.classList.remove("no-js");
    element.classList.add("js");
  }
}

/* Back to top */
function maintainBackToStartVisibility() {
  let backToStart = document.querySelector("#back-to-start");

  if (backToStart) {
    let windowHeight = window.innerHeight;
    let documentHeight = document.body.scrollHeight;
    let scrollY = window.scrollY;

    if (windowHeight * 1.5 < documentHeight && scrollY >= 0.5 * windowHeight) {
      backToStart.style.display = "flex";
      backToStart.style.position = "fixed";
      backToStart.style.right = "0";
      backToStart.style.bottom = "0";
    } else {
      backToStart.style.display = "none";
      backToStart.style.position = "static";
      backToStart.style.border = "none";
      backToStart.style.padding = "none";
    }
  }
}

/* Page load time */
function displayLoadTime() {
  if (performance) {
    //PerformanceNavigationTiming API
    let loadTime = document.querySelector("#load-time");
    let templateString = loadTime
      ? loadTime.innerText
      : "This page loaded in ${seconds} seconds";
    let duration = 0;
    let entries = performance.getEntriesByType("navigation");
    if (entries && entries.length) {
      duration = entries[0].loadEventStart;
    }

    if (duration) {
      let seconds = (duration / 1000).toFixed(2);
      templateString = templateString.replace("${seconds}", seconds);
      console.log(templateString);

      if (loadTime) {
        loadTime.innerHTML = templateString;
        loadTime.style.display = "";
      }
    } else {
      if (loadTime) {
        loadTime.style.display = "none";
      }
    }
  }
}

addEventListener("DOMContentLoaded", isJavaScript);
addEventListener("load", maintainBackToStartVisibility);
addEventListener("scroll", maintainBackToStartVisibility);
addEventListener("resize", maintainBackToStartVisibility);

/* ActiveToc */
addEventListener("load", function () {
  ActiveToc.init({
    tocContainer: ".table-of-contents",
    onHighlight: function (tocEntry, heading) {
      let headingHint = document.querySelector("#heading-hint");

      if (headingHint && tocEntry) {
        let headingHintLink = headingHint.querySelector("a");
        if (headingHintLink) {
          headingHint.style.display = "inline";
          headingHintLink.href = tocEntry.href;
          headingHintLink.innerText = tocEntry.innerText;
        }
      }
    },
    offHighlight: function () {
      let headingHint = document.querySelector("#heading-hint");
      if (headingHint) {
        headingHint.style.display = "none";
      }
    },
  });
});

addEventListener("load", displayLoadTime);
