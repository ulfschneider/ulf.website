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

{% highlight css %}
/* DON´T DO THAT */
*:focus {
  outline: none;
}
{% endhighlight %}

## How to style the focus indication
Styling the `outline` is the preferred method to indicate focus as opposed to styling `border` or `background`. `outline` [doesn´t affect the box model](https://css-tricks.com/almanac/properties/o/outline/), while `border` does, which means `outline` will not change the position of adjacent elements. Also, `background` wouldn´t work for images.

The contrast ratio of the `outline` against the background must be at least 3:1, according to [WCAG 2.1 Non-text Contrast – Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&showtechniques=324%2C331#non-text-contrast
). Check the contrast of colors with the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). Ideally the outline should be solid and thick enough to easily grasp it.

I´m first resetting style by disabling the outline.
{% highlight css %}
* {
  outline: none;
}
{% endhighlight %}

Then, I´m styling the outline for any element that can gain focus. Depending on the website, it might sometimes be that the outline will partially be hidden by other site elements. To overcome that in some cases, I´m giving the focused element a <code>position</code> and a <code>z-index</code>.

{% highlight css %}
*:focus {
  outline: 3px solid yellow;
  outline-offset: 2px;
  position: relative;
  z-index: 11111;
}
{% endhighlight %}

## References

Mozilla Hacks, Hidde de Vries
: [Indicating focus to improve accessibility](https://hacks.mozilla.org/2019/06/indicating-focus-to-improve-accessibility/)

WebAIM, Jared Smith
: [The plague of outline:0](https://webaim.org/blog/plague-of-outline-0/)

CSS-Tricks, Sara Cope
: [outline](https://css-tricks.com/almanac/properties/o/outline/)
