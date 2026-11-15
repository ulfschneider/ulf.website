---
title: A politely animated `<details><summary>`
tags:
  - code
  - css
---
I came across this little trick to animate the expand/collapse marker of a `<details><summary>` element. This is what it looks like in practice:

<div class="my-base">
<details>
<summary>An animated expansion indicator</summary>
<p class="text-xl">:-)</p>
</details>
</div>

```html
<details>
<summary>An animated expansion indicator</summary>
<p class="text-xl">:-)</p>
</details>
```

<div class="my-base">
<details>
<summary class="text-xl">A larger font size for summary text</summary>
<p>The indicator will grow with the font size used for the summary element!</p>
</details>
</div>

```html
<details>
<summary class="text-xl">A larger font size for summary text</summary>
<p>The indicator will grow with the font size used for the summary element!</p>
</details>
```

The following CSS will do it:

```css
details > summary {
  /*
   * Establish the positioning context for the marker.
   * Reserve space at the start so the text, including wrapped lines,
   * begins after the marker.
   */
  position: relative;
  display: block;
  cursor: pointer;
  list-style: none;
  padding-inline-start: 2em;
}
/* Hide the default disclosure marker. */
details > summary::marker {
  content: "";
}
details > summary::-webkit-details-marker {
  display: none;
}
/*
 * Draw the horizontal stroke of the plus/minus marker.
 * Absolute positioning keeps it out of the text flow; 0.5lh centers it
 * on the first line even when the summary wraps.
 */
details > summary::before,
details > summary::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 0.5lh;
  width: 0.75em;
  border-block-start: 0.1em solid currentColor;
  transform: translateY(-50%);
}
/* Rotate the second stroke to make a plus sign when collapsed. */
details > summary::after {
  transform: translateY(-50%) rotate(90deg);
}
/* Remove the vertical stroke when expanded, leaving a minus sign. */
details[open] > summary::after {
  transform: translateY(-50%) rotate(0deg);
}
/* Animate the vertical stroke only when motion is allowed. */
@media (prefers-reduced-motion: no-preference) {
  details > summary::after {
    transition: transform 150ms ease;
  }
}
```