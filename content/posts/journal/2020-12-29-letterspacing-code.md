---
title: Letterspacing of code elements
---
Widening the letterspacing of `<code>` elements in the flow of text nicely emphasizes the *code-nature* of the element without using a monospace font or a different color. I think it works for a sans-serif font but not so well for a serif. The visual effect is subtle yet noticable while reading through the text. Also, I´m lowering the `font-size` property of the `<code>` a bit, to accomodate for the enhanced letter-spacing and to create a little more distinction.

Take care not to apply the technique for multi-line code-blocks, as the widened letterspacing will occupy too much space in that case and make the legibility difficult. 

<figure>
<figcaption>CSS code for letterspacing of <code>&lt;code&gt;</code> elements while <em>not</em> applying the rule for multi-line code.</figcaption>
{% highlight css %}
code:not(pre code) {
	letter-spacing: 3px;
	font-size: .9em;
	font-family: inherit; /*use the font of the flow text*/
	}
{% endhighlight %}
</figure>

Applying the CSS to the following HTML

<figure>
<figcaption>HTML</figcaption>
{% highlight html %}
<p>This <code>HTML</code> has a code distinction.</p>
<p>This HTML doesn´t.</p>
{% endhighlight %}
</figure>

will lead to a rendering of

<figure>
<img src="/img/letterspacing-code.jpg" alt="Two paragraphs, one with a letter-spaced code named HTML, the other with non-letter-spaced HTML.">
</figure>
