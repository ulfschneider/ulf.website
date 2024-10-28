---
title: A responsive tablist without JavaScript
tags:
  - code
  - css
abstract: Extending the most simple tablist to be used as a vertical list
---
This post is about extending the [most simple tablist](/2024-10-04-most-simple-tablist/) to be used as a vertical list (an accordeon), or to change from a horizontal tablist into an accordeon below a certain screen width. Again, it´s pure HTML and CSS, without JavaScript. Some explanations are copied from the original post into this one, because the content didn´t change.

[[toc]]

## Demo

<p class="codepen" data-height="550" data-default-tab="result" data-slug-hash="qBeVNzN" data-pen-title="Vertical tabs without JavaScript" data-user="ulfschneider" style="height: 550px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/qBeVNzN">
  Vertical tabs without JavaScript</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## The HTML

Here is the HTML for the four tablists used in the demo. Each list has the same HTML, except for the names of the radio input controls and the assigned CSS class for the tablist. Please refer to the [CodePen](https://codepen.io/ulfschneider/pen/qBeVNzN ) for the exact HTML.

```html
<h2>Horizontal tablist</h2>

<div role="tablist">

  <!-- tab 1 -->
  <label role="tab">
    <input type="radio" name="tab" checked><span>Tab 1</span>
  </label>
  <div role="tabpanel"><span style="color:blue">Tab 1 content</span></div>

  <!-- tab 2 -->
  <label role="tab">
    <input type="radio" name="tab"><span>Tab 2</span>
  </label>
  <div role="tabpanel"><span style="color:red">Tab 2 content</span></div>

  <!-- tab 3 -->
  <label role="tab">
    <input type="radio" name="tab"><span>Tab 3</span>
  </label>
  <div role="tabpanel"><span style="color:green">Tab 3 content</span></div>

</div>

<h2>Vertical tablist (accordeon)</h2>

<!-- vertical class assigned -->
<div role="tablist" class="vertical"> 
  ...
    <!-- different name -->
    <input type="radio" name="vert-tab" checked>
  ...
</div>

<h2>Responsive tablist</h2>

<!-- max-sm:vertical class assigned -->
<div role="tablist" class="max-sm:vertical">
  ...
    <!-- different name -->
    <input type="radio" name="resp-tab" checked>
  ...
</div>

<h2 dir="rtl">Responsive tablist, right to left direction, set with the attribute <code>dir="rtl"</code></h2>

<div role="tablist" dir="rtl" class="max-sm:vertical">
  ...
    <!-- different name -->
    <input type="radio" name="rtl-tab" checked>
  ...
</div>
```

For accessibility reasons, the styling depends on roles. For the vertical lists an CSS class is required in addition. Please refer to [<cite> ARIA: tablist role</cite>](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role) for details. The following roles are used:

`role="tablist"`
: for the tablist container,

`role="tab"`
: for each tab label,

`role="tabpanel"`
: for the content of each tab.

Inside of the tablist container, each tab is described by a `<label role="tab">` for the tab label, followed by a `<div role="tabpanel">` for the tab content. The `<label>` wraps an `<input type="radio">` and a `<span>` with the label text. The `<input>` maintains the state of the tablist, and if checked, indicates the active tab. It´s an `<input type="radio">`, because checking one input of the tablist must uncheck all others. In the demo the border color of the tabs is derived from the CSS `currentColor`. The `<span>` for the label text is used to allow a different color styling of the text for the active tab, without affecting the border color of the tab. The same can be found for the tab content, which is wrapped for the same reason in a `<span>` (but could as well be wrapped in a `<div>`).

The `input` of the first tab has the attribute `checked` to visualize the content of the first tab by default.

>[!Note]
>All the `<input>` elements of a single tablist must share the same value for the `name` attribute. A second and third tablist on the same page (like in the demo) must choose a different value for the `name` attribute to not share the state between the  tablists! 

## The horizontal tablist CSS

```css
[role="tablist"] {
  --outline: auto Highlight;
  --tab-label-padding: 0.5em;
  --tab-label-next-padding: 2em;
  --tab-label-radius: 0.15em;
  --tab-label-active-background: white;
  --tab-label-active-color: currentColor;
  --tab-content-x-padding: 0;
  --tab-content-y-padding: 1em;
  --tab-border-color: currentColor;
  --tab-border-width: 1px;

  --vertical-tab-label-active-background: white;
  --vertical-tab-label-active-color: currentColor;

  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

/* hide everything, except the tab labels */
[role="tablist"] > *:not(label[role="tab"]) {
  display: none;
}

/* keep the inputs on the page, but make them invisible to allow for keyboard focus */
[role="tablist"] > label[role="tab"] > input[type="radio"] {
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}

/* when using the tab key on the keyboard to focus into the tablist, indicate the outline */
[role="tablist"] > label[role="tab"]:has(:focus-visible) {
  outline: var(--outline);
  outline-offset: calc(-1 * var(--tab-label-padding));
}

/* tab label */
[role="tablist"] > label[role="tab"] {
  padding: var(--tab-label-padding);
  padding-inline-end: var(--tab-label-next-padding);
  cursor: pointer;
  margin-bottom: calc(-1 * var(--tab-border-width));
  border-bottom: none;
  border-left: var(--tab-border-width) solid transparent;
  border-top: var(--tab-border-width) solid transparent;
  border-right: var(--tab-border-width) solid transparent;
}

/* selected tab label */
[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  background: var(--tab-label-active-background);
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
  border-bottom: none;
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
}

[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) > * {
  color: var(--tab-label-active-color);
}

/* tab content */
[role="tablist"] > label[role="tab"]:has(input:checked) + [role="tabpanel"] {
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  order: 99;
  display: block;
  width: 100%;
  position: relative;
  z-index: -1;
  padding: var(--tab-content-y-padding) var(--tab-content-x-padding);
}
```

### Styling the horizontal tablist container

The tablist container is selected by `[role="tablist"]`. Basic settings  of the tablist, like border-width and border-color, are stored in the [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to allow for easy adjustment.

`display: flex` 
: allows to have all tab labels placed in a row,

`flex-wrap: wrap`
: will wrap the tab into a new line if there is not sufficient space left anymore, this is important to visualize the tab content below all the tab labels,

`align-items:flex-end`
: will move the content of each tab label to the bottom, in case there are tab labels of different height.

As a first step all content inside of the tab container is hidden, except the tab labels. This is achieved with:

```css
/* hide everything, except the tab labels */
[role="tablist"] > *:not(label[role="tab"]) {
  display: none;
}
```



### Styling the horizontal tab labels

The assignment

```css
/* keep the inputs on the page, but make them invisible to allow for keyboard focus */
[role="tablist"] > label[role="tab"] > input[type="radio"] {
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}
```

is targeting the `input[type="radio"]` elements inside the tab labels. They are only visually hidden to allow them receiving a keyboard focus. The following styling will show the outline for keyboard-activated focus and not for mouse-activated focus.

```css
/* when using the tab key on the keyboard to focus into the tablist, indicate the outline */
[role="tablist"] > label[role="tab"]:has(:focus-visible) {
  outline: var(--outline);
  outline-offset: calc(-1 * var(--tab-label-padding));
}
```

Each tab label receives its styling through

```css
/* tab label */
[role="tablist"] > label[role="tab"] {
  padding: var(--tab-label-padding);
  padding-inline-end: var(--tab-label-next-padding);
  cursor: pointer;
  margin-bottom: calc(-1 * var(--tab-border-width));
  border-bottom: none;
  border-left: var(--tab-border-width) solid transparent;
  border-top: var(--tab-border-width) solid transparent;
  border-right: var(--tab-border-width) solid transparent;
}
```

Mind the line `padding-inline-end: var(--tab-label-next-padding)`, which will add padding to the right for content with the attribute `dir="ltr"` and will add padding to the left for content with `dir="rtl"`, to accommodate for the direction of text flow. The fourth tablist in the demo is relying on this setting.

The selected tab is styled by 

```css 
/* selected tab label */
[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
  background: var(--tab-label-active-background);
}

[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) > * {
  color: var(--tab-label-active-color);
}
```

It´s important to have a negative bottom margin of the same size as the used border width for every tab: `margin-bottom: calc(-1 * var(--tab-border-width))`. The solid background for the active tab, with `background: var(--tab-label-active-background)`, as well plays a role here. Please refer to the styling of the tab content to understand why that´s the case.

The color of the active tab text is not set directly on the label but on the child elements of the label to not interfere with the `currentColor` that is used for the label border.

### Styling the tab content for the horizontal tablist

The visualized tab content is styled with:

```css
/* tab content */
[role="tablist"] > label[role="tab"]:has(input:checked) + [role="tabpanel"] {
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  order: 99;
  display: block;
  width: 100%;
  position: relative;
  z-index: -1;
  padding: var(--tab-content-y-padding) var(--tab-content-x-padding);
}
```

Only the tab content that is a direct sibling of the checked tab label is styled and displayed, which is ensured by the selector:

```css
[role="tablist"] > label[role="tab"]:has(input:checked) + [role="tabpanel"]
```

The tab content is always placed at the end of the tab labels inside of tablist container, which can be achieved because it is part of a flexbox and has the property `order: 99`.  It will take the full width of the tablist container through `width: 100%; display:block;`, which forces the visible tab content to wrap into the next line of the container and then take the entire available space.

The tab container has a top border to separate it visually from the tab labels: `border-top: var(--tab-border-width) solid var(--tab-border-color);`. The selected tab label should cover that horizontal line to makle a strong indication of what label belongs to the presented tab content. This is possible because the tab content has `position:relative; z-index: -1;`, which brings the tab content in the stacking context under the tab labels. Because the tab labels have a negative bottom margin, and the checked label has a solid background, the background of the label will cover the horizontal line. 


## The vertical tablist CSS

The vertical tablist receives all the styles from the horizontal tablist and modifies parts. Therefore the styling of the vertical list must come after the styling of the horizontal list.

The vertical tablist will have the CSS class `vertical` assigned to the tab container, therefore all selectors of the vertical list start with `.vertical[role="tablist]`.

```css

/* vertical tablist styling */

/* tab label */
.vertical[role="tablist"] > label[role="tab"] {
  display: block;
  width: 100%;
  border: var(--tab-border-width) solid var(--tab-border-color);
  border-bottom: none;
}

.vertical[role="tablist"] > label[role="tab"]:first-of-type {
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
}

.vertical[role="tablist"] > label[role="tab"]:last-of-type {
  border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
  border-bottom: var(--tab-border-width) solid var(--tab-border-color);
}

/* selected tab label */
.vertical[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  border-bottom: none;
  background: var(--vertical-tab-label-active-background);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input[type="radio"]:checked)
  > * {
  color: var(--vertical-tab-label-active-color);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input[type="radio"]:checked):last-of-type {
  border-radius: 0;
}

/* tab content */
.vertical[role="tablist"]
  > label[role="tab"]:has(input:checked)
  + [role="tabpanel"] {
  order: unset;
  padding: var(--tab-label-padding) var(--tab-label-padding);
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input:checked)
  + [role="tabpanel"]:last-of-type {
  border-bottom: var(--tab-border-width) solid var(--tab-border-color);
  border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
}
```

### Styling the vertical tab labels

Every tab label will use the available width and take an entire line in the tab container. Therefore the key styling of the tab labels is `display:block; width 100%;`. All other styles within this section are modifying the border drawing so that it suits vertically stacked tab labels instead of horizontally aligned tabs.

```css
/* tab label */
.vertical[role="tablist"] > label[role="tab"] {
  display: block;
  width: 100%;
  border: var(--tab-border-width) solid var(--tab-border-color);
  border-bottom: none;
}

.vertical[role="tablist"] > label[role="tab"]:first-of-type {
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
}

.vertical[role="tablist"] > label[role="tab"]:last-of-type {
  border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
  border-bottom: var(--tab-border-width) solid var(--tab-border-color);
}
```

The selected tab receives border styling and color styling with:

```css
/* selected tab label */
.vertical[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  border-bottom: none;
  background: var(--vertical-tab-label-active-background);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input[type="radio"]:checked)
  > * {
  color: var(--vertical-tab-label-active-color);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input[type="radio"]:checked):last-of-type {
  border-radius: 0;
}
```

### Styling the tab content for the vertical tablist

A vertical tablist will display the tab content not always at the bottom of all tabs, like the horizontal tablist does. Instead the tab content of the selected tab must be displayed right below the selected tab label. Therefore the flexbox order setting of the horizontal list, which is `order: 99;`, is unset with `order: unset;`, to display each tab content below the associated tab label. This is the key styling here. All other styles tweak padding and borders.

```css
/* tab content */
.vertical[role="tablist"]
  > label[role="tab"]:has(input:checked)
  + [role="tabpanel"] {
  order: unset;
  padding: var(--tab-label-padding) var(--tab-label-padding);
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
}

.vertical[role="tablist"]
  > label[role="tab"]:has(input:checked)
  + [role="tabpanel"]:last-of-type {
  border-bottom: var(--tab-border-width) solid var(--tab-border-color);
  border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
}
```


## The responsive vertical tablist CSS

The styling of the responsive vertical class is identical to the vertical class, except, it is wrapped in a media query and the selector class is named `max-sm:vertical`.

`max-sm:` is a so-called variant, and it´s similar to what Tailwind CSS does. The variant class is to be used in your HTML like `class="max-sm:vertical"`, which means, for a screen of max sm (max small) size, the vertical styles will be applied. Above the sm screen size the vertical styles will be ignored and instead the horizontal styles are used. Small in our case is a 600 px wide screen. 

The backslash in `.max-sm\:vertical` is required to allow the `:` being part of a CSS class name. You will not use the `\` when assigning the class to your HTML.

> [!Note] 
> Unfortunately, the entire code for the previous `.vertical`  CSS class has to be duplicated within the media query `@media screen and (max-width: 600px) {}` for the responsive variant to work. When you use Tailwind CSS, you can achieve the same result much simpler by defining just the vertical class from above within your Tailwind CSS files and then apply the standard screen-width variants that Tailwind already has on board. You do not need to define the variants yourself in that case!

```css
@media screen and (max-width: 600px) {
  /* tab label */
  .max-sm\:vertical[role="tablist"] > label[role="tab"] {
    display: block;
    width: 100%;
    border: var(--tab-border-width) solid var(--tab-border-color);
    border-bottom: none;
  }

  .max-sm\:vertical[role="tablist"] > label[role="tab"]:first-of-type {
    border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
  }

  .max-sm\:vertical[role="tablist"] > label[role="tab"]:last-of-type {
    border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
    border-bottom: var(--tab-border-width) solid var(--tab-border-color);
  }

  /* selected tab label */
  .max-sm\:vertical[role="tablist"]
    > label[role="tab"]:has(input[type="radio"]:checked) {
    border-bottom: none;
    background: var(--vertical-tab-label-active-background);
  }

  .max-sm\:vertical[role="tablist"]
    > label[role="tab"]:has(input[type="radio"]:checked)
    > * {
    color: var(--vertical-tab-label-active-color);
  }

  .max-sm\:vertical[role="tablist"]
    > label[role="tab"]:has(input[type="radio"]:checked):last-of-type {
    border-radius: 0;
  }

  /* tab content */
  .max-sm\:vertical[role="tablist"]
    > label[role="tab"]:has(input:checked)
    + [role="tabpanel"] {
    order: unset;
    padding: var(--tab-label-padding) var(--tab-label-padding);
    border-left: var(--tab-border-width) solid var(--tab-border-color);
    border-right: var(--tab-border-width) solid var(--tab-border-color);
  }

  .max-sm\:vertical[role="tablist"]
    > label[role="tab"]:has(input:checked)
    + [role="tabpanel"]:last-of-type {
    border-bottom: var(--tab-border-width) solid var(--tab-border-color);
    border-radius: 0 0 var(--tab-label-radius) var(--tab-label-radius);
  }
}
```
