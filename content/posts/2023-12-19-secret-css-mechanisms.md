---
title: Secret CSS Mechanisms
tags: 
  - css
  - star
---
Switch on learning mode. Josh´s talk, <cite><a href="https://www.youtube.com/watch?v=Xt1Cw4qM3Ec
">Secret Mechanisms of CSS</a></cite>, is great. I had plenty aha-moments while following his explanations and examples.
[[toc]]

## CSS has 5 layout modes

1. Flow layout (default)
2. Positioned layout
3. Flexible Box layout
4. Grid layout (not covered in the talk)
5. Table layout (not covered in the talk)

## Flow layout (default)
-  It was the first layout mode and is heavily inspired by real-world documents.
-  There are **blocks** flowing in vertical order top to bottom, and inside the blocks there are **inline**  elements flowing in horizontal order left to right.
-  The horizontal left-to-right flow is true for english-speaking countries – CSS can accomodate as well for languages that are written right-to-left or even top-to-bottom (in that blocks would flow right to left or left to right, and the inline direction would flow top to bottom).
-  **Block elements** are very greedy, they don´t want anything else to be in their horizontal space. They flow top to bottom and take all horizontal space they cat get. They have their default width set to `auto`, and not `100%`.
-  **Inline elements** do not have vertical margins, because they do not want to push content in the vertical direction (the block flow direction). Inline elements can have horizontal margins (which is the inline flow direction). Inline elements can also have vertical padding, but the padding will not push sibling block elements into a different location and will also not push the block element that contains an inline element into a different location!
-  **Inline-block elements** are put on the page as if they were inline elements but when it comes to layout, inline-block elements can have a height and vertical margins and padding. The vertical spacing of inline-block elements will push sibling block level elements around!
-  Block elements and inline-block elements form a **rectangle around them** and nothing else can be inside of that rectangle. This is different for inline elements, as they **flow and wrap** and do not form a rectangle around them.
-  Block elements calculate their **width** by the available widt hthat is given them by their parent. Width works from an element **up the tree all its parents**. 
-  Block elements calculate their **height** by looking at their childrens height. Height works from an element **down the tree all its children**.
-  This way of calculating width and height can be linked to how width and height work in paper documents. Every document has a limited and fixed width, but can have an unlimited height (by printing multiple pages).

## Positioned layout

- Elements are not positioned according to flow rules, instead they are **anchored to something else**.
- **Absolute** positioned elements will be anchored to their nearest positioned anchestor, up the tree, which is ultimately the document. They do not take space within the document flow.
- **Fixed** positioned elements are anchored to the viewport. They do not take space within the document flow.
- Added by me: **Relative** positioned elements take space within the document flow and are positioned according to flow layout. In addition they can be positioned with `top`, `left`, `right`, and `bottom`.
- `z-index` will work for positioned layout and for flex layout, but **not for flow layout**.
- Think of stacking contexts for `z-index` like of version numbers. A `z-index` of a child is like a minor version of the parents `z-index`.

## Flexible Box layout

> [!TIP]
> It´s not mentioned in the video, but Josh has this excellent [<cite>Interactive Guide to Flexbox</cite>](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/).

- Flexbox allows to fine-tune how items are distributed along a main axes, and aligned in the cross axis. 
- The primary axis goes through all flex items at once, while the cross axis will cross each item on its own. `justify-content` will work on the primary axis and affect all flex items as a group (therefore `justify-self` does not exist). `align-items` will work on the cross axis and therefore affect flex items individually (therefore `align-self` exists).
- `margin-right: auto` on a flex item will push all right handed flex items to the right.
- Like all layout modes, flexbox can choose to overwrite CSS properties (like for `z-index`).
- `width` is only a hypothetical size for a flex item. 
- `flex: 1;` on flex items will give them the same size, as long as the items have the same padding. It´s a shortcut for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%;` 
- `flex-grow: 1` If all items have flex-grow set to 1, the remaining space in the container will be distributed equally to all children.
- `flex-basis` works the same way as width (in a flex row) or height (in a flex column).

<figure>
https://www.youtube.com/watch?v=Xt1Cw4qM3Ec
<figcaption><cite><a href="https://www.youtube.com/watch?v=Xt1Cw4qM3Ec
">Secret Mechanisms of CSS</a></cite>, by Josh Comeau</figcaption>
</figure>
