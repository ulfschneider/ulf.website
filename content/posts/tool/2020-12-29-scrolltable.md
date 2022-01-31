---
title: markdown-it-scrolltable
tags: tools
---
A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-scrolltable) to wrap any `<table>` into a `<div>` for horizontal scrolling on narrow screens. 

[[toc]]

## Examples

```md
Column | Column
------ | ------
Cell   | Cell  
```

will become 

<div class="scroll-table" style="overflow-x:auto">
    <table>
        <thead>
            <tr>
                <th>Column</th>
                <th>Column</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
        </tbody>
    </table>
</div>
```

html inside of your markdown, like for example

```html
<table>
    <thead>
        <tr>
            <th>Column</th>
            <th>Column</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Cell</td>
            <td>Cell</td>
        </tr>
    </tbody>
</table>
```

will be transformed into 

```html
<div class="scroll-table" style="overflow-x:auto">
    <table>
        <thead>
            <tr>
                <th>Column</th>
                <th>Column</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
        </tbody>
    </table>
</div>
```


## Usage

```js
var markdownIt = require('markdown-it');
var markdownItScrollTable = require('markdown-it-scrolltable');

markdownIt({
        html: true
    })
    .use(markdownItScrollTable);
```


