---
title: The most simple tablist
tags:
  - css
  - code
abstract: My current approach of building a tablist without JavaScript. It´s relying on flexbox, relative positioning, and the :has() selector.
---

[[toc]]

## Demo

<figure>
<p class="codepen" data-height="550" data-default-tab="result" data-slug-hash="mdNPmmb" data-pen-title="Tabs using the :has() selector and without JavaScript" data-user="ulfschneider" style="height: 513px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/mdNPmmb">
  Tabs using the :has() selector and without JavaScript</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</figure>

## The HTML

```html
<div role="tablist">
	<!-- tab 1 -->
  <label role="tab">
    <input type="radio" name="tab" checked>Tab 1
  </label>
  <div role="tabpanel">Tab 1 content</div>

	<!-- tab 2 -->
  <label role="tab">
    <input type="radio" name="tab">Tab 2
  </label>
  <div role="tabpanel">Tab 2 content</div>

	<!-- tab 3 -->
  <label role="tab">
    <input type="radio" name="tab">Tab 3
  </label>
  <div role="tabpanel">Tab 3 content</div>
</div>
```

For accessibility reasons, the styling depends on roles and not on CSS classes. Please refer to [<cite> ARIA: tablist role</cite>](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role) for details. In this case it´s

`role="tablist"`
: for the overall tablist container,

`role="tab"`
: for each tab label,

`role="tabpanel"`
: for the content of each tab.

Inside of the tablist container, each tab is described by a `<label role="tab">` for the tab label, followed by a `<div role="tabpanel">` for the tab content. The `<label>` wraps an `<input type="radio">`. The `<input>` maintains the state of the tablist, and if checked, indicates the opened tab. It´s an `<input type="radio">`, because checking one input must uncheck all others.

The `input` of the first tab has the attribute `checked` to visualize the content of the first tab by default.

>[!Note]
>All the `<input>` elements of a single tablist must share the same value for the `name` attribute, in the above example it is `name="tab"`. A second tablist on the same page must choose a different value for the `name` attribute to not share the state between the two tablists! 

## The CSS

> [!Note] Oct 5, 2024
> I´ve added styling for the outline color of focused tabs.

> [!Note] Oct 27, 2024
> I changed the selector for the focus styling to `:has(:focus-within)` to show a focus indicator only when the element received focus via keyboard. Can it be seen as a bug in Safari, that the initial keyboard focus is visualized, disappears when selecting tabs with the arrow keys, and appears again when reaching the first or last tab?

```css
[role="tablist"] {
  --outline: auto Highlight;
  --tab-label-padding: 0.5em;
  --tab-label-radius: 0.15em;
  --tab-label-min-width: 4em;
  --tab-label-active-background: white;
  --tab-content-x-padding: 0;
  --tab-content-y-padding: 1em;
  --tab-border-color: currentColor;
  --tab-border-width: 1px;

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
  padding: var(--tab-label-padding) var(--tab-label-padding);
  min-width: var(--tab-label-min-width);
  margin-bottom: calc(-1 * var(--tab-border-width));
  border-left: var(--tab-border-width) solid transparent;
  border-top: var(--tab-border-width) solid transparent;
  border-right: var(--tab-border-width) solid transparent;
  cursor: pointer;
}

/* selected tab label */
[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
  background: var(--tab-label-active-background);
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


### The styling of the tablist container

The tablist container is selected by `[role="tablist"]`. Basic settings  of the tablist, like tabbing and border-width, are stored in the [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to allow for easy adjustment.

`display: flex` 
: allows to have all tab labels placed in a row.

`flex-wrap: wrap`
: will wrap the tab into a new line if there is not sufficient space left anymore, this is important to visualize the tab content

`align-items:flex-end`
: will move the content of each tab label to the bottom, in case there are tab labels of different height

With 

```css
[role="tablist"] > *:not(label[role="tab"]) {
  display: none;
}
```

all content inside of the tab container is hidden, except the tab labels.

### The styling of the tab labels

The assignment

```css
[role="tablist"] > label[role="tab"] > input[type="radio"] {
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}
```

is targeting the `input[type="radio"]` elements inside the tab labels. They are only visually hidden to allow them receiving a keyboard focus. In that case, to indicate the keyboard focus with an outline, the following assignment is required:

```css
[role="tablist"] > label[role="tab"]:has(:focus-visible) {
  outline: var(--outline);
  outline-offset: calc(-1 * var(--tab-label-padding));
}
```

Each tab label receives it´s basic styling through

```css
[role="tablist"] > label[role="tab"] {
  padding: var(--tab-label-padding) var(--tab-label-padding);
  min-width: var(--tab-label-min-width);
  margin-bottom: calc(-1 * var(--tab-border-width));
  border-left: var(--tab-border-width) solid transparent;
  border-top: var(--tab-border-width) solid transparent;
  border-right: var(--tab-border-width) solid transparent;
  cursor: pointer;
}
```

The selected tab is styled by 

```css
[role="tablist"] > label[role="tab"]:has(input[type="radio"]:checked) {
  border-left: var(--tab-border-width) solid var(--tab-border-color);
  border-top: var(--tab-border-width) solid var(--tab-border-color);
  border-right: var(--tab-border-width) solid var(--tab-border-color);
  border-radius: var(--tab-label-radius) var(--tab-label-radius) 0 0;
  background: var(--tab-label-active-background);
}
```

It´s important to have a negative bottom margin of the same size as the used border width for every tab: `margin-bottom: calc(-1 * var(--tab-border-width))`. The solid background for the active tab, with `background: var(--tab-label-active-background)`, as well plays a role here. Please refer to the styling of the tab content to understand why that´s the case.

### Styling the tab content

The visualized tab content is styled with:

```css
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

All tab content is hidden except the tab content that is a direct sibling of the checked tab label label, which is ensured by the selector

```css
[role="tablist"] > label[role="tab"]:has(input:checked) + [role="tabpanel"]
```

The tab content is always placed at the end of the tab labels inside of tablist flexbox container because it has the property `order: 99`.  It will take the full width of the tablist container through `width: 100%; display:block;`, which forces the visible tab content to wrap into the next line of the container.

The tab container has a top border to separate it visually from the tab labels: `border-top: var(--tab-border-width) solid var(--tab-border-color);`. The selected tab label should cover that horizontal line to makle a strong indication of what label belongs to the presented tab content. This is possible because the tab content has `position:relative; z-index: -1;`, which brings the tab content in the stacking context under the tab labels. Because the tab labels have a negative bottom margin, and the checked label has a solid background, the background of the label will cover the horizontal line. 

