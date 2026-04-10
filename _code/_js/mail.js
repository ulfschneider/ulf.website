// email obfuscation
const mObserver = new IntersectionObserver(decode, {
  root: document.querySelector("body"),
  rootMargin: "0px",
  scrollMargin: "0px",
  threshold: 0.1
})

function decode(entries, observer) {
  const parts = ["mai", "l", "@", "ul", "fschnei", "der.", "io"]
  for (const e of entries) {
    if (e.isIntersecting && e.target.classList.contains("m-link")) {
      e.target.setAttribute("href", "mai" + "lto:" + parts.join(""))
      mObserver.unobserve(e.target)
    }

    if (e.isIntersecting && e.target.classList.contains("m")) {
      e.target.innerText = parts.join("")
      mObserver.unobserve(e.target)
    }
  }
}

function observe() {
  for (o of document.querySelectorAll(".m-link,.m")) {
    mObserver.observe(o)
  }
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", observe)
} else {
  observe()
}
