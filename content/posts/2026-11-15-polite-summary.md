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
  padding-inline-start: var(--outdent-indent-space);
}
/* Hide the browser's default disclosure marker. */
details > summary::marker {
  content: "";
}
details > summary::-webkit-details-marker {
  display: none;
}
/*
 * Draw the horizontal stroke of the marker. The pseudo-elements are
 * absolutely positioned, so they don't take up space in the text flow.
 *
 * inset-inline-start: 0 places the strokes at the summary's start edge:
 * left in left-to-right layouts, right in right-to-left layouts.
 *
 * border-block-start draws a thin line along the block-start edge, usually
 * the top. currentColor makes the line match the summary text.
 *
 * top: 0.5lh places the line halfway down the first line of text.
 * translateY(-50%) shifts it up by half its own height, centering it there.
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
/*
 * Keep the first stroke horizontal. Rotate the second by 90 degrees so
 * it crosses the first stroke to form a plus sign.
 */
details > summary::after {
  transform: translateY(-50%) rotate(90deg);
}
/*
 * When the details element is open, rotate the second stroke back to
 * horizontal. Both strokes now overlap to form a minus sign.
 */
details[open] > summary::after {
  transform: translateY(-50%) rotate(0deg);
}
/* Animate the rotating stroke only when the user allows motion. */
@media (prefers-reduced-motion: no-preference) {
  details > summary::after {
    transition: transform 150ms ease;
  }
}
```