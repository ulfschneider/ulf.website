---
title: Set the space between direct siblings
tags:
  - code
  - css
---
```css
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
```

[<cite>My favourite 3 lines of CSS</cite>](https://piccalil.li/blog/my-favourite-3-lines-of-css/) by Andy Bell is not only three lines of code to set the space between direct siblings that works for any [block flow direction](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode). Andy explains why he is using custom properties and how to tune the setting for different contexts, like in prose text and spacing around the `figure` element or headings. 

[<cite>The Stack</cite>](https://every-layout.dev/layouts/stack/) as a further resource is excellent. It´s adding the idea of modular scale.

It´s worth reading Andy´s 24 Ways article [<cite>Managing Flow and Rhythm with CSS Custom Properties</cite>](https://24ways.org/2018/managing-flow-and-rhythm-with-css-custom-properties/). The text does not use CSS logical properties, because it is dating back to 2018, but is a good companion resource. 

