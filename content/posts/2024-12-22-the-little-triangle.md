---
title: The little triangle in the tooltip
tags:
  - code
  - css
  - bookmark
---
Juan Diego Rodríguez is exploring four techniques to create [<cite>The little triangle in the tooltip</cite>](https://css-tricks.com/the-little-triangle-in-the-tooltip/):

- clever borde (the border property of the tooltip is used for the triangle and cannot be used for anything else, but the technique is simple)
- rotated square (does not work completely in Safari for me)
- trimming the square with clip-path (versatile and usable even at the far ends of the tooltip)
- border-image and clip-path (apply the triangle without using pseudo-elements)
