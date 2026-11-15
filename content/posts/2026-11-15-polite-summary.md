---
title: A politely animated `<details><summary>`
tags:
  - code
  - css
---
I came across this little trick to animate the expand/collapse marker of a `<details><summary>` element. This is what it looks like in practice:

<style>
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
  padding-inline-start: 1.5em;
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
/*
 * Add marker-end to the summary to move both strokes to the inline end.
 */
details > summary.marker-end {
  padding-inline-start: 0;
  padding-inline-end: 1.5em;
}
details > summary.marker-end::before,
details > summary.marker-end::after {
  inset-inline-start: auto;
  inset-inline-end: 0;
}
</style>

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


<div class="my-base max-w-prose">
<details>
<summary class="text-xl marker-end">Move the marker to the end</summary>
<p>You can as well move the marker from the start to the end.</p>
</details>
</div>

```html
<details>
<summary class="text-xl marker-end">Move the marker to the end</summary>
<p>You can as well move the marker from the start to the end.</p>
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
  padding-inline-start: 1.5em;
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
/* Add marker-end to the summary to move both strokes to the inline end.
 */
details > summary.marker-end {
  padding-inline-start: 0;
  padding-inline-end: 1.5em;
}
details > summary.marker-end::before,
details > summary.marker-end::after {
  inset-inline-start: auto;
  inset-inline-end: 0;
}
```

Here is a codepen to play with:

<p class="codepen" data-height="300" data-pen-title="Untitled" data-version="2" data-default-tab="result" data-slug-hash="raybxwx" data-user="ulfschneider" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/editor/ulfschneider/pen/01a1de26-fee0-7ec5-b4b2-455dd54f4a00">
  Untitled</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>