---
title: markdown-it-trimmer
tags: tools
---

A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-trimmer) to trim some whitespace from the resulting markup. The trimming occurs during the rendering process of the markup.

[[toc]]

## Opening list items with `<li>`

After opening list items with `<li>` , any whitespace, including new lines, is removed. This can be useful when you are styling your list items with `li::before` and use display settings of `inline` or `inline-grid` (as an example). In such scenarios a whitespace between the opening `<li>` tag and the following content would always be rendered as an additional space by the browser, which is something you typically wouldn´t want.

HTML written inside of your markdown text will not be affected by this plugin - only markdown output rendering is altered.

With the markdown-it-trimmer the following output html will never be produced:

```html
<ul>
    <li>
        <p>Hello world</p>
    </li>
</ul>
```

Instead, the markup will get trimmed into:

```html
<ul>
    <li><p>Hello world</p>
    </li>
</ul>
```

## Usage

```js
var markdownIt = require('markdown-it');
var markdownItTrimmer = require('markdown-it-trimmer');

markdownIt({
        html: true
    })
    .use(markdownItTrimmer);
```

## Configuration

There is no configuration.
