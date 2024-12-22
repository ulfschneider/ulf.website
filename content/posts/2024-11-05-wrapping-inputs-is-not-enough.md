---
title: Wrapping inputs is not enough
tags:
  - accessibility
---
My usual practice of labeling an HTML input field is so called *implicit association*:

```html
<label>
    Email address
    <input name="email" type="email">
</label>
```

The entire `label` area is clickable and will  lead to focusing the input field when clicked. The code is elegant in my view without the clutter of explicit assignment of ids to associate the label to the input.

According to [<cite>Should form labels be wrapped or separate?</cite>](https://www.tpgi.com/should-form-labels-be-wrapped-or-separate/) this technique is not sufficient and should be enhanced by *explicit association*, because implicit association is not reliably supported by voice control software.

```html
<label for="email">
    Email address
    <input id="email" name="email" type="email">
</label>
```