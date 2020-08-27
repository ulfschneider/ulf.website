---
title: Indicating the focused element
---

[[toc]]

## Focus is important for keyboard navigation
The currently focused element on a website, which might be a link, a form field, or a button, must visually indicate its focus state. The indication of the focus state will improve or even enable keyboard navigation. 

Without seeing what interactive element has the focus it´s impossible to navigate a website with the keyboard. For a keyboard user that situation is comparable to removing the mouse cursor for mouse users. 

On a page, at any given time, there is *one* element that has the focus. Directly after loading the page, it is probably the document, but once you start to click or tab, it will be one of the aforementioned interactive elements. 

## Do not disable the focus outline
By default, a browser will indicate focus with an `outline` CSS style, which can be changed. Sometimes web designers remove the outline to make the site design more elegant without *disturbing* outlines. I´m guilty of having done it many times.

<figure>
{% highlight css %}
/* DON´T DO THAT */
*:focus {
  outline: none;
}
{% endhighlight %}
<figcaption>DON´T DO THAT: disabling the outline indication for focused elements in your CSS</figcaption>
</figure>

## How to style the focus indication
Styling the `outline` is the preferred method to indicate focus as opposed to styling `border` or `background`. `outline` doesn´t affect the box model, while `border` does, which means `outline` is less invasive. Also, `background` wouldn´t work for images.

The contrast ratio of the `outline` against the background must be at least 3:1, according to [WCAG 2.1 Non-text Contrast – Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&showtechniques=324%2C331#non-text-contrast
). Check the contrast of colors with the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). Ideally the outline should be solid and thick enough to easily grasp it.

<figure>
{% highlight css %}
* {
  outline: none;
}

*:focus {
  outline: 3px solid yellow;
  outline-offset: 2px;
  position: relative;
  z-index: 11111;
}

{% endhighlight %}
<figcaption>
<p>I´m first disabling the outline. Then, I´m styling the outline for any element that can gain focus. Depending on the website, it might sometimes be that the outline will partially be hidden by other site elements. To overcome that, I´m giving the focused element a <code>position</code> and a <code>z-index</code>.
</figcaption>
</figure>

<figure>
{% highlight css %}
*:hover, *:active {
	outline: none;
}
{% endhighlight %}
<figcaption>If the outline should not be visible for mouse pointer events, the outline can be disabled for all <code>:hover</code> and <code>:active</code> elements. The outline will still remain visible for keyboard events. Place this CSS code <em>after</em> the <code>*:focus</code> selector from above.</figcaption>
</figure>

## References

WebAIM, Jared Smith
: [The plague of outline:0](https://webaim.org/blog/plague-of-outline-0/)

Mozilla Hacks, Hidde de Vries
: [http://alistapart.com/article/frameworksIndicating focus to improve accessibility](https://hacks.mozilla.org/2019/06/indicating-focus-to-improve-accessibility/)
