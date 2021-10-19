---
title: Expandable sections within a CSS Grid (Quickview)
tags: [code, css]
refer: Kev Bonnett, 15 Oct 2021, CSS-Tricks
---
Kev Bonett gives an excellent example of how to style expandable CSS Grid sections with only some lines of CSS in his [CSS-Tricks article](https://css-tricks.com/expandable-sections-within-a-css-grid/). Kev has a [CodePen](https://codepen.io/basherkev/pen/rNwpwgP) to play with it. His idea is:

```css
.grid {
  /*Trick 1: 
  have a grid with columns 
  that are arranged automatically 
  within the available space*/
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, 20rem);
  
  /*Trick 3: 
  fill the gaps*/
  grid-auto-flow: dense;
}

.fullwidth {
  /*Trick 2: 
  have a full width card
  start in column 1, 
  and span every column up to the last one*/
  grid-column: 1 / -1;
}
```

