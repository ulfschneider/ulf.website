---
title: The JavaScript Intl object
tags: code
---
Raymond Camden^[[<cite>Using Intl for Short Number Formatting</cite>](https://www.raymondcamden.com/2023/01/04/using-intl-for-short-number-formatting), Raymond Camden, Jan 4, 2023] uses the `compact` notation option of the [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/) function to create abbreviated number formats. 

<figure class="no-js-hidden demo-box">
<label>Provide a large number to be compacted
<div><input type="number" id="input-number"></div>
</label>
<dl class="mt-ryt-lg">
<dt>Short compact</dt>
<dd id="short-number" class="text-5xl font-bold"></dd>
<dt>Long compact</dt>
<dd id="long-number" class="text-5xl font-bold"></dd>
</dl>
<script>
function compact(value) {
	let shortNumber = document.querySelector('#short-number');
	let shortNotation = new Intl.NumberFormat('en-US', { 
		notation:'compact'
		}).format(inputNumber.value); 
	shortNumber.innerHTML = shortNotation;
	let longNumber = document.querySelector('#long-number');	
	let longNotation = new Intl.NumberFormat('en-US', { 
		notation:'compact',
		compactDisplay: 'long'
		}).format(inputNumber.value); 	
		longNumber.innerHTML = longNotation;
}
let inputNumber = document.querySelector('#input-number');
['keyup', 'change'].forEach(name => {
	inputNumber.addEventListener(name, event => {
		compact(inputNumber.value);
	});
});
compact(inputNumber.value);
</script>
</figure>

E.g., to format the number 12499 into 12K, all you have to do is:

```js
let value = 12499;
let shortNotation = new Intl.NumberFormat('en-US', { 
	notation:'compact'
	}).format(value); 
console.log(shortNotation); //12K
```

A longer notation, like formatting 12499 into 12 thousand, can be achieved with the `compactDisplay` option:

```js
let value = 12499;
let longNotation = new Intl.NumberFormat('en-US', { 
	notation:'compact',
	compactDisplay: 'long'
	}).format(value); 
console.log(longNotation); //12 thousand
```

The `Intl.NumberFormat` allows to control many more things with just a little configuration, like currency formatting, rounding, and units. It will return localized, beautiful formattings. And while you are around, look at what other great things [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) can do, such as [Plural Rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules), [List Formats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat), and [Relative Time Formats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat). I was not aware.


