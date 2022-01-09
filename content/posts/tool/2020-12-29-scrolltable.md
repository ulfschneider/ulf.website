---
title: markdown-it-scrolltable
tags: tools
---
A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-scrolltable) to wrap any `<table>` into a `<div>` for horizontal scrolling on narrow screens. 

[[toc]]

## Examples

<figure>
<figcaption>A markdown table</figcaption>
{% highlight md %}
Column | Column
------ | ------
Cell   | Cell  
{% endhighlight %}
</figure>

will become 

<figure>
<figcaption>A html <code>&lt;table&gt;</code> wrapped into <code>&lt;div&gt;</code></figcaption>
{% highlight html %}
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
{% endhighlight %}
</figure>

html inside of your markdown, like for example

<figure>
<figcaption>A html table inside of markdown text</figcaption>
{% highlight html %}
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
{% endhighlight %}
</figure>

will be transformed into 

<figure>
<figcaption>A html <code>&lt;table&gt;</code> wrapped into <code>&lt;div&gt;</code></figcaption>
{% highlight html %}
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
{% endhighlight %}
</figure>

## Usage

<figure>
<figcaption>JavaScript</figcaption>
{% highlight js %}
var markdownIt = require('markdown-it');
var markdownItScrollTable = require('markdown-it-scrolltable');

markdownIt({
        html: true
    })
    .use(markdownItScrollTable);
{% endhighlight %}
</figure>

