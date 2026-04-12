---
title: Keep your email address away from spammers
tags: code
bookmark: true
---
Use [<cite>Email address obfuscation: What works in 2026?</cite>](https://spencermortensen.com/articles/email-obfuscation/) by Spencer Mortensen to keep your email address away from spammers.

This could be a case for a web component combining multiple of the presented techniques. Unfortunately, what really works requires JavaScript, which can be an issue. My favorite pattern so far is *2.10 User Interaction*, because it provides decent protection against spammers without additional library dependencies. I am using it with the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and CSS class name selectors `.oma` for *obfuscated email address* and `.oml` for *obfuscated email link*. 

```js
// email obfuscation
const mObserver = new IntersectionObserver(decode)
function decode(entries, observer) {
  const parts = ["d", "o", "n", "a", "l", "d", "@", "d", "u", "c", "k", ".", "c", "o", "m"]
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

- execute JS,
- discover the dynamic script,
- load the script, and
- execute it,

to get your email address.