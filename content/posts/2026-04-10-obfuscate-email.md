---
title: Keep your email address away from spammers
tags: code
bookmark: true
---
Use [<cite>Email address obfuscation: What works in 2026?</cite>](https://spencermortensen.com/articles/email-obfuscation/) by Spencer Mortensen to keep your email address away from spammers.

This could be a case for a web component combining multiple of the presented techniques. Unfortunately, what really works requires JavaScript, which can be an issue. When you are willing to accept that, my favorite is *2.10, User Interaction*. I am using this pattern with the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API):

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
addEventListener("DOMContentLoaded", observe)
```