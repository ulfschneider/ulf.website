---
title: Back to Top
abstract: A Back to Top link helps users navigate to the top (start) of long pages.
outline: true
tags: [accessibility, css, code]
---

[[toc]]

## Behavior of a Back to Top link

- The link is only necessary on longer pages that require scrolling to get back to the top of the page. Shorter pages should not contain a *Back to Top* link, because clicking on such link doesn´t have an effect and is irritating the user.
- Users expect to see the link at the bottom right corner of the screen. 
- The link should be labeled *Back to Top* because that´s conveying clearly what the link will do. An icon alone, like an arrow-up, is not sufficient because it cannot be handled properly by a screenreader.
- The link should stand out visually but shouldn´t distract from content, nor hide content.
- The link has to be presented to all users and, if not visible, like on a short page, it has to be invisible for all users. 
- Once visible, the link should not move around when scrolling.

## HTML to create the Back to Top link

<figure>
{% highlight html %}
<html id="start">
  <body>
  <!-- the contents of the page -->
  <a href="#start" id="back-to-start">Back to Top</a>
  </body>
</html>
{% endhighlight %}
</figure>

## JavaScript to hide the link on shorter pages

<figure>
{% highlight javascript %}
function maintainBackToStartVisibility() {
    let backToStart = document.getElementById('back-to-start');
    if (backToStart) {
        let windowHeight = window.innerHeight;
        let documentHeight = document.body.scrollHeight;

        if (windowHeight * 1.5 < documentHeight) {
            backToStart.style.display = '';
        } else {
            backToStart.style.display = 'none';
        }
    }
}

addEventListener('load', event => maintainBackToStartVisibility());
addEventListener('scroll', event => maintainBackToStartVisibility());
addEventListener('resize', event => maintainBackToStartVisibility());
{% endhighlight %}
</figure>

## References

1. CSS-Tricks, Chris Coyier [Need to scroll to the top of the page?](https://css-tricks.com/need-to-scroll-to-the-top-of-the-page/)
2. Nielsen Norman Group, [Back-to-Top Button Design Guidelines](http://nngroup.com/articles/back-to-top/)

