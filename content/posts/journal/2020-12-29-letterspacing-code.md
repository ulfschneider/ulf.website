---
title: Letterspacing of code elements
---
Widening the letterspacing of `<code>` elements in the flow of text nicely emphasizes the *code-nature* of the element without having to deal with an additional font or a different color (at least when using a sans-serif font). Take care not to apply the technique for multi-line code-blocks, as the widened letterspacing would occupy too much space and make the legibility difficult. Also, I´m lowering the `font-size` property of the `<code>` a bit, to accomodate for the enhanced letter-spacing.

<figure>
<figcaption>CSS code for letterspacing of <code>&lt;code&gt;</code> elements while not applying the rule for multi-line code.</figcaption>
{% highlight css %}
code:not(pre code) {
	letter-spacing: 3px;
	font-size: .9em;
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
