---
title: Remove unwanted scrollbars
tags: [code, css]
---
[Detect CSS Overflow Elements](https://davidwalsh.name/detect-overflow-elements) is a tiny hack by David Walsh to detect the root cause of unwanted scrollbars on a web page. Use the following JavaScript.

~~~js
document.querySelectorAll('*').forEach(el => {
  if (el.offsetWidth > document.documentElement.offsetWidth) {
      console.log('Found the worst element ever: ', el);
  }
});
~~~