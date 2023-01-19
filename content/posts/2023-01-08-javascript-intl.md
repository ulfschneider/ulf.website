---
title: The JavaScript Intl object
tags: code
---
Raymond Camden^[[<cite>Using Intl for Short Number Formatting</cite>](https://www.raymondcamden.com/2023/01/04/using-intl-for-short-number-formatting), Raymond Camden, Jan 4, 2023] uses the `compact` notation option of the [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/) function to create abbreviated number formats. 

<figure>
<p class="codepen" data-height="526" data-default-tab="result" data-slug-hash="RwBpXBZ" data-user="ulfschneider" style="height: 526px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/RwBpXBZ">
  Untitled</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</figure>

To format the number 12499 into *12K,* all you have to do is:

```js
let value = 12499;
let shortNotation = new Intl.NumberFormat('en-US', { 
	notation:'compact'
	}).format(value); 
console.log(shortNotation); //12K
```

A longer notation, like formatting 12499 into *12 thousand,* can be achieved with the `compactDisplay` option:

```js
let value = 12499;
let longNotation = new Intl.NumberFormat('en-US', { 
	notation:'compact',
	compactDisplay: 'long'
	}).format(value); 
console.log(longNotation); //12 thousand
```

The `Intl.NumberFormat` allows to control many more things, with just a little configuration, like currency formatting, rounding, and units. It will return localized, beautiful formattings. And while you are around, look at what other great things [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) can do, such as [Plural Rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules), [List Formats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat), and [Relative Time Formats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat). I was not aware. Check out the the [Intl Explorer](https://www.intl-explorer.com/?locale=de-DE)^[[<cite>Intl Explorer</cite>](https://www.intl-explorer.com/?locale=de-DE) by [Jesper Orb](https://jesperorb.com)].



