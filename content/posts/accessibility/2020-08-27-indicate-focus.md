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
Styling the `outline` is the preferred method to indicate focus as opposed to styling `border` or `background`. `outline` [doesn´t affect the box model](https://css-tricks.com/almanac/properties/o/outline/), while `border` does, which means `outline` will not change the position of adjacent elements and  is therefore better than adjusting the border. Also, changing the `background` for focused elements wouldn´t work for images.

The contrast ratio of the `outline` against the background must be at least 3:1, according to [WCAG 2.1 Non-text Contrast—Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&showtechniques=324%2C331#non-text-contrast
). The contrast of colors can be checked with the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). Ideally the outline should be solid and thick enough to attract attention.

Here is how I do it: I´m first resetting the style by disabling the outline.

{% highlight css %}
* {
  outline: none;
}
{% endhighlight %}

Then, I´m styling the outline for any element that can gain focus.

{% highlight css %}
*:focus {
  outline: 3px solid yellow;
  outline-offset: 2px;
}
{% endhighlight %}

## References

1. Mozilla Hacks, Hidde de Vries, [Indicating focus to improve accessibility](https://hacks.mozilla.org/2019/06/indicating-focus-to-improve-accessibility/)
2. WebAIM, Jared Smith, [The plague of outline:0](https://webaim.org/blog/plague-of-outline-0/)
3. WebAIM, [Contrast Checker](https://webaim.org/resources/contrastchecker/).
4. CSS-Tricks, Sara Cope, [outline](https://css-tricks.com/almanac/properties/o/outline/)
5. MDN Web Docs, [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
