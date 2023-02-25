---
title: console.count()
tags: [til, code]
---
`console.count()` logs the number of times that a particular content has been logged out by `count()`.

```js
[...'Hello world'].forEach(letter => console.count(letter));

//output
//h: 1
//e: 1
//l: 1
//l: 2
//o: 1
// : 1
//w: 1
//o: 2
//r: 1
//l: 3
//d: 1
```

See [CodePen console.count()](https://codepen.io/ulfschneider/pen/QWVWPqy) and [MDN console.count()](https://developer.mozilla.org/en-US/docs/Web/API/console/count).