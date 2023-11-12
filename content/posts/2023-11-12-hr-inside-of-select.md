---
title: hr tags inside of the select options list
tags: 
  - til
  - code
---
Safari and Chrome support `<hr>` tags inside of a `<select>` options list^[[<cite>Select element: now with horizontal rules</cite>](https://developer.chrome.com/blog/hr-in-select/)] to create logical deviders. It is the beauty of HTML that the `<hr>` will simply be ignored by other browsers.

```html
<select>
<option>All options</option>
<hr>
<option>Option A</option>
<option>Option B</option>
<option>Option C</option>
<option>Option D</option>
</select>
```

Using the above code, when your browser supports the `<hr>` tag inside of `<select>` options, the text "All options" will be divided from the other options by a separator line in the below example.

<figure>
<select>
<option>All options</option>
<hr>
<option>Option A</option>
<option>Option B</option>
<option>Option C</option>
<option>Option D</option>
</select>
<figcaption>When your browser supports the &lt;hr> tag inside of &lt;select>, it will separate "All options" from the other options with a small line.</figcaption>
</figure>


