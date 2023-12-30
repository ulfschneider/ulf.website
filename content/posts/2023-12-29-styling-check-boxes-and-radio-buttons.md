---
title: My current approach of styling checkboxes and radio buttons
tags:
  - css
  - code
---
[[TOC]]

## Advantages and disadvantages of the alternate approach

For long I used [Sara´s approach of styling checkboxes and radio buttons](https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/).  I think the following, different approach, is even simpler and has advantages:

- No SVG (if you see that as an advantage).
- No dealing with visibility, opacity, or clip-path to hide the input controls.
- You are not forced to wrap the input controls into a container and assign class styles, like `c-checkbox`. You can use each control in any way you would use an unstyled control.

The disadvantages could be:

- The solution depends on the browser supporting `appearance: none`, which, according to [caniuse.com](https://caniuse.com/mdn-css_properties_appearance_none), is supported by 96.71% of web browsers.
- The absence of SVG, in case you are an SVG-wizard, like Sara.

## Demo

<figure>
<p class="codepen" data-height="650" data-default-tab="result" data-slug-hash="PoLqerX" data-user="ulfschneider" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/PoLqerX">
  Styling of checkboxes and radio buttons</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
<figcaption>A <a href="https://codepen.io/ulfschneider/pen/PoLqerX ">CodePen</a> with the sample styling of a checkbox and three radio buttons.</figcaption>
</figure>

## Feature detection

The styles will be applied if the browser supports `appearance: none`, which is covered by the statement

```css
@supports (appearance: none) {
  /*all styles will be within these curly braces*/
}
```

## Radio buttons

Three custom properties are introduced to adjust the basic appearance of the radio buttons:

```css
:root {
  --radio-size: 1.5em;
  --radio-border-width: 1px;
  --radio-check-size: calc(var(--radio-size) - 10px);
}
```

The `--radio-size` determines the square dimension of the radio control (in this case it´s equal to the diameter, because the control will be a circle). The `--radio-border-width` is the width of the outer border of the radio circle. The `--radio-check-size` determines the diameter of the inner circle of a checked radio control.

Next, the unchecked radio control is styled by using the custom properties:

```css
input[type="radio"] {
  appearance: none;
  font-size: inherit;
  position: relative;
  width: var(--radio-size);
  height: var(--radio-size);
  margin: 0;
  border: var(--radio-border-width) solid currentColor;
  border-radius: 50%;
  cursor: pointer;
}
```

The default browser appearance is deactivated through `appearance: none`. Then the font size of the controls context is inherited with `font-size: inherit`. The positioning of the control is `position: relative`, which does not change anything for the control itself, but will provide an anchoring point for the checkmark that is introduced later. The default display setting of a radio button is `display: inline-block`, therefore it can be made a square by assigning `width: var(--radio-size); height: var(--radio-size)`. It shouldn´t have any margin, therefore  `margin: 0` is set. The border color of the outer circle will be in the current text color and is set by `border: var(--radio-border-width) solid currentColor`. Then the control is made a cirle by applying `border-radius: 50%`. When the mouse cursor is hovering the control, it should become a pointer, which is achieved by `cursor: pointer`.

Next, the checkmark for the radio button is defined:

```css
input[type="radio"]:checked::before {
  content: "";
  position: absolute;
  width: var(--radio-check-size);
  height: var(--radio-check-size);
  border-radius: 50%;
  margin-top: calc(
    (var(--radio-size) - var(--radio-check-size)) / 2 -
      var(--radio-border-width)
  );
  margin-left: calc(
    (var(--radio-size) - var(--radio-check-size)) / 2 -
      var(--radio-border-width)
  );
  background-color: currentColor;
}
```

With the selector  `input[type="radio"]:checked::before`  a new child is introduced and placed *before* all other children of a checked radio button. This first child will become the inner circle of the checked radio button. For the first child to get rendered, it needs to have a content value, in this case an empty string, which is achieved by `content: ""`. To position the first child precisely, the position setting will be set to `position: absolute`, which anchors all margins of the first child to the relatively positioned parent, which is the input control. Because of the absolute positioning of the child, the display setting of the child is computed as `display:block`, and therefore it can be made a square, but smaller than the outer circle, by assigning `width: var(--radio-check-size); height: var(--radio-check-size)`. The square is transformed into a circle with `border-radius: 50%`. Now the smaller circle needs to be positioned in the center of the outer circle, which is achieved with the calculation of  `margin-top: calc((var(--radio-size) - var(--radio-check-size)) / 2 -  var(--radio-border-width))` for  the top margin and `margin-left: calc((var(--radio-size) - var(--radio-check-size)) / 2 - var(--radio-border-width))` for the left margin. Finally, the inner circle will be filled with the current text color, through `background-color: currentColor`.

That´s the new radio button.

## Checkbox

The basic appearance and the tuning of checkboxes is configured with the following custom properties:

```css
:root {
  --check-size: 1.5em;
  --check-border-width: 1px;
  --check-mark-width: calc(var(--check-size) - 10px);
  --check-mark-height: calc(var(--check-mark-width) / 1.8 );
  --check-mark-line-width: 3px;
  --check-mark-rotation: rotate(-60deg);
  --check-mark-adjust-top: calc(-0.4 * var(--check-mark-height));
  --check-mark-adjust-left: calc(-0.1 * var(--check-mark-width));
}
```

The size of the checkbox square will be identical to the size of the radio button. It is set with `--check-size: 1.5em`. The border width of the checkbox square is set with `--check-border-width: 1px`. All other settings are to style the checkmark, which is tweaked to fit into the checkbox square. 

The checkbox control is defined as follows:

```css
input[type="checkbox"] {
  appearance: none;
  font-size: inherit;
  position: relative;
  width: var(--check-size);
  height: var(--check-size);
  margin: 0;
  border: var(--check-border-width) solid currentColor;
  border-radius: 0;
  cursor: pointer;
}
```

The styling is pretty much the same as for a radio button, except the checkbox is not circled and instead squared. The default appearance is removed by setting `appearance: none` and the font size is inherited from the context with `font-size: inherit`. To allow the checkmark to be positioned absolute inside the checkbox, the input control is assigned a relative position with `position: relative`. The input control by default has a display setting of `display: inline-block`, therefore a width and a height can be assigned through `width: var(--check-size); height: var(--check-size)`. The checkbox should not have a margin, it is set to `margin: 0`, and the border color of the checkbox will be the current text color, set by `border: var(--check-border-width) solid currentColor`. The checkbox should not be rounded in any way, which is ensured by `border-radius: 0`. When the mouse cursor hovers over the control, it should become a pointer: `cursor: pointer`.

Now the checkmark hack. The checkmark is made up by a rectangled `div` with a border on only the left and the bottom side. The rectangle is then rotated to position it inside the checkbox. 

```css
input[type="checkbox"]:checked::before {
  content: "";
  position: absolute;
  width: var(--check-mark-width);
  height: calc(var(--check-mark-height));
  transform: var(--check-mark-rotation);
  border: var(--check-mark-line-width) solid currentColor;
  border-top: none;
  border-right: none;
  margin-top: calc(
    (var(--check-size) - var(--check-mark-height)) / 2 -
      var(--check-border-width) + var(--check-mark-adjust-top)
  );
  margin-left: calc(
    (var(--check-size) - var(--check-mark-width)) / 2 -
      var(--check-border-width) + var(--check-mark-adjust-left)
  );
  background-color: transparent;
}
```

I use the same technique as with the radio button check indicator, by introducing a first child for the checked checkbox with the selector  `input[type="checkbox"]:checked::before`. To have the child rendered for a checked input control, the content must have a value, therefore I assign the empty string with `content: ""`. The checkmark needs to be positioned precisely inside of the checkbox, which again is achieved with absolute positioning, by setting `position: absolute`. Absolute positioning will make the display property of the first child getting computed to `display: block`, which allows to give the checkmark a width and a height through `width: var(--check-mark-width); height: var(--check-mark-height)`. This results in a rectangled div, which will be rotated to get a slanted checkmark, by assigning `transform: var(--check-mark-rotation)`. To look like a checkmark, the left and bottom border of the rectangle are shown in the current text color with `border: var(--check-mark-line-width) solid currentColor; border-top: none; border-right: none`. The exact position of the checkmark inside the checkbox is tweaked by setting a top margin and a left margin, with `margin-top: calc((var(--check-size) - var(--check-mark-height)) / 2 - var(--check-border-width) + var(--check-mark-adjust-top)); margin-left: calc((var(--check-size) - var(--check-mark-width)) / 2 -  var(--check-border-width) + var(--check-mark-adjust-left))`. Finally the background of the checkmark is set transparent by `background: transparent`.

That´s the new checkbox.

## The complete CSS

Here is the complete CSS for both, the radio button and the checkbox.

```css
@supports (appearance: none) {
  :root {
    --radio-size: 1.5em;
    --radio-border-width: 1px;
    --radio-check-size: calc(var(--radio-size) - 10px);
  }
  input[type="radio"] {
    appearance: none;
    font-size: inherit;
    position: relative;
    width: var(--radio-size);
    height: var(--radio-size);
    margin: 0;
    border: var(--radio-border-width) solid currentColor;
    border-radius: 50%;
    cursor: pointer;
  }
  input[type="radio"]:checked::before {
    content: "";
    position: absolute;
    width: var(--radio-check-size);
    height: var(--radio-check-size);
    border-radius: 50%;
    margin-top: calc(
      (var(--radio-size) - var(--radio-check-size)) / 2 -
        var(--radio-border-width)
    );
    margin-left: calc(
      (var(--radio-size) - var(--radio-check-size)) / 2 -
        var(--radio-border-width)
    );
    background-color: currentColor;
  }

  :root {
    --check-size: 1.5em;
    --check-border-width: 1px;
    --check-mark-width: calc(var(--check-size) - 10px);
    --check-mark-height: calc(var(--check-mark-width) / 1.8 );
    --check-mark-line-width: 3px;
    --check-mark-rotation: rotate(-60deg);
    --check-mark-adjust-top: calc(-0.4 * var(--check-mark-height));
    --check-mark-adjust-left: calc(-0.1 * var(--check-mark-width));
  }
  input[type="checkbox"] {
    appearance: none;
    font-size: inherit;
    position: relative;
    width: var(--check-size);
    height: var(--check-size);
    margin: 0;
    border: var(--check-border-width) solid currentColor;
    border-radius: 0;
    cursor: pointer;
  }
  input[type="checkbox"]:checked::before {
    content: "";
    position: absolute;
    width: var(--check-mark-width);
    height: calc(var(--check-mark-height));
    transform: var(--check-mark-rotation);
    border: var(--check-mark-line-width) solid currentColor;
    border-top: none;
    border-right: none;
    margin-top: calc(
      (var(--check-size) - var(--check-mark-height)) / 2 -
        var(--check-border-width) + var(--check-mark-adjust-top)
    );
    margin-left: calc(
      (var(--check-size) - var(--check-mark-width)) / 2 -
        var(--check-border-width) + var(--check-mark-adjust-left)
    );
    background-color: transparent;
  }
}
```
