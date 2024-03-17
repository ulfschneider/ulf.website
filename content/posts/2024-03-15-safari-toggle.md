---
title: Safari has a native toggle control
tags: 
  - code
  - til
---
Safari is supporting toggles natively, [starting with version 17.4](https://webkit.org/blog/15054/an-html-switch-control/). At the time of writing Safari is the *only* browser supporting toggles. In Safari it is called a switch. It´s implementend as a progressive enhancement on top of a checkbox: `
<input type="checkbox" switch/>`. The `switch` attribute makes the checkbox render as a toggle. Browsers other than Safari will not understand the `switch` attribute and ignore it. I came across this while writing [<cite>Toggles suck</cite>](/2024-03-15-toggles-suck/).

<figure>
<label class="max-w-fit flex flex-row gap-ryt items-center"><input type="checkbox" checked switch /> <span>A toggle for Safari, a checkbox for all other browsers</span></label>
<figcaption>In case you are using Safari, you should see a toggle. Because the <code>switch</code> is ignored by browsers that do not know it, you will see a checkbox when using a different browser.</figcaption>
</figure>

