---
title: enterkeyhint
tags: code
---
The [`enterkeyhint`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint) global HTML attribute allows to define the action label (or icon) to present for the enter key on virtual keyboards, like on touch devices. E.g.: 

```html
<input type="submit" enterkeyhint="search">
``` 

will display a <kbd>Search</kbd> label, or something similar, instead of the Enter symbol <kbd>⏎</kbd> on the virtual keyboard. Because `enterkeyhint` is a global attribute, it can be used on any HTML element and is not limited to `input` elements.

<table>
<caption>The possible values of the <code>enterkeyhint</code> global HTML attribute.</caption>
<tr><td><code>enterkeyhint="enter"</code></td><td><kbd>⏎</kbd></td></tr>
<tr><td><code>enterkeyhint="done"</code></td><td><kbd>Done</kbd></td></tr>
<tr><td><code>enterkeyhint="go"</code></td><td><kbd>Go</kbd></td></tr>
<tr><td><code>enterkeyhint="next"</code></td><td><kbd>Next</kbd></td></tr>
<tr><td><code>enterkeyhint="previous"</code></td><td><kbd>Previous</kbd></td></tr>
<tr><td><code>enterkeyhint="search"</code></td><td><kbd>Search</kbd></td></tr>
<tr><td><code>enterkeyhint="send"</code></td><td><kbd>Send</kbd></td></tr>
</table>
