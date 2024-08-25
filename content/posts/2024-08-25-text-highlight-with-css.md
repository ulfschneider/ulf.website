---
title: Highlighting text with CSS
tags: 
  - code
  - css
---
Highlighting text on a web page and making it appear like it was done with a highlighter pen (sometimes called a skeuomorphism ^[<q>Skeuomorphism involves designing digital interfaces that imitate physical elements, reducing the learning curve for unfamiliar interactions.</q>, [<cite>Skeuomorphism</cite>](https://www.nngroup.com/articles/skeuomorphism/), Megan Chan, Nielsen Norman Group]), can look like this:

<figure>
<style>.mark-highlight {
  background: linear-gradient(
      100deg,
      rgba(255, 221, 64, 0) 0.9%,
      rgba(255, 221, 64, 1) 2.4%,
      rgba(255, 221, 64, 0.5) 5.8%,
      rgba(255, 221, 64, 0.2) 93%,
      rgba(255, 221, 64, 0.7) 96%,
      rgba(255, 221, 64, 0) 98%
      ),
    linear-gradient(
      180deg,
      rgba(255, 221, 64, 0) 0%,
      rgba(255, 221, 64, 0.3) 7.9%,
      rgba(255, 221, 64, 0) 15%
  );
  border-radius: 0.125em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0.1em;
}
@media (prefers-color-scheme: dark) {
  .mark-highlight {
    background: rgb(255, 221, 64);
    border-radius: 0;
  }
}</style>
<p class="text-xl">One morning, when Gregor Samsa woke from troubled dreams, he found himself <mark class="mark-highlight">transformed in his bed into a horrible vermin</mark>.</p>
<figcaption>Highlighting text with CSS</figcaption>
</figure>

It is done with CSS and nothing else. For the above example I used the approach of [Stephen Lewis](https://www.stephenlewis.me/blog/css-highlighter-effect/) and changed opacity values slightly to get a more intense yellow background.

It requires a light background of the web page because of the translucent yellow color. Therefore you cannot use it for dark mode. For that case I added a media query and simplified the approach, so that at least you can highlight text in dark mode.

Here is the code:

```css
mark,
.mark {
  background: linear-gradient(
      100deg,
      rgba(255, 221, 64, 0) 0.9%,
      rgba(255, 221, 64, 1) 2.4%,
      rgba(255, 221, 64, 0.5) 5.8%,
      rgba(255, 221, 64, 0.2) 93%,
      rgba(255, 221, 64, 0.7) 96%,
      rgba(255, 221, 64, 0) 98%
      ),
    linear-gradient(
      180deg,
      rgba(255, 221, 64, 0) 0%,
      rgba(255, 221, 64, 0.3) 7.9%,
      rgba(255, 221, 64, 0) 15%
  );
  border-radius: 0.125em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0.1em;
}

@media (prefers-color-scheme: dark) {
  mark,
  .mark {
    background: rgb(255, 221, 64);
    border-radius: 0;
  }
}
```


There is another [good approach by Max](https://max.hn/thoughts/how-to-create-a-highlighter-marker-effect-in-css), which is standing out because of the step-by-step explanation Max is providing. However, the creative use of gradients with Stephen´s approach looks more realistic to me.