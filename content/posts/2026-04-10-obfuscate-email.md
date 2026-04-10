---
title: Keep your email address away from spammers
tags: code
bookmark: true
---
Use [<cite>Email address obfuscation: What works in 2026?</cite>](https://spencermortensen.com/articles/email-obfuscation/) by Spencer Mortensen to keep your email address away from spammers.

This could be a case for a web component combining multiple of the presented techniques. Unfortunately, what really works requires JavaScript, which can be an issue. My favorite pattern so far is *2.10 User Interaction*, which I am using pattern with the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API):

```js
// email obfuscation
const mObserver = new IntersectionObserver(decode, {
  root: document.querySelector("body"),
  rootMargin: "0px",
  scrollMargin: "0px",
  threshold: 0.1
})
function decode(entries, observer) {
  const parts = ["don", "ald", "@", "du", "ck", ".c", "om"]
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
```

To challenge the crawler a bit more, you could put that script into a dedicated file `mail.js`, and load it from inside of your `head`, like:

```js
<script>
  //challenge the crawler!
  const s = document.createElement("script")
  s.src = "/js/mail.js"
  document.head.appendChild(s)
</script>
```

This will require the crawler to

- execute JS
- discover dynamic script
- load it
- execute it

to get your email address.