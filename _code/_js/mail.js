// email obfuscation
const mObserver = new IntersectionObserver(decode)

function decode(entries, observer) {
  const parts = []
  for (const e of entries) {
    if (e.isIntersecting && e.target.classList.contains("oml")) {
      e.target.setAttribute("href", "mai" + "lto" + ":" + parts.join(""))
      mObserver.unobserve(e.target)
    }

    if (e.isIntersecting && e.target.classList.contains("oma")) {
      e.target.innerText = parts.join("")
      mObserver.unobserve(e.target)
    }
  }
}

function observe() {
  for (o of document.querySelectorAll(".oml,.oma")) {
    mObserver.observe(o)
  }
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", observe)
} else {
  observe()
}
