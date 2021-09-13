---
title: Letterspacing of &lt;code&gt; elements
tags: [code, css, type]
---
Widening the letterspacing of `<code>` elements in the flow of text emphasizes the *code-nature* of the element without using a different font or a different foreground/background color. I think it works for a sans-serif font but not for a serif. It is of use when having the same font for text and code. For example, you can easily have your text set with [iA Writer Quattro](https://ia.net/writer/blog/a-typographic-christmas), and use the very same typeface for your `<code>` elements. 

The visual effect is subtle yet noticable. I´m lowering the `font-size` property of the `<code>`, to accomodate for the enhanced letter-spacing and to create more distinction.

Don´t apply the technique for multi-line code-blocks, as the widened letterspacing will occupy too much space in that case and make the legibility difficult. 

<figure class="bleed-right">
<figcaption>CSS code for letterspacing of <code>&lt;code&gt;</code> elements while <em>not</em> applying the rule for multi-line code.</figcaption>
{% highlight css %}
code {
	letter-spacing: 3px;
	font-size: .9em;
	font-family: inherit; /*use the font of the text flow*/
	}
pre code {
  letter-spacing: unset; /*don´t apply letter-spacign for multi-line code*/
  }
{% endhighlight %}
</figure>

Applying the CSS to the following HTML

<figure class="bleed-right">
<figcaption>HTML</figcaption>
{% highlight html %}
<p>This <code>HTML</code> has a code distinction.</p>
<p>This HTML doesn´t.</p>
{% endhighlight %}
</figure>

will lead to a rendering of

<figure>
<img src="/img/journal/letterspacing-code.jpg" alt="">
<figcaption>Two paragraphs. The first with a letter-spaced code named HTML, the second with non-letter-spaced HTML.</figcaption>
</figure>
