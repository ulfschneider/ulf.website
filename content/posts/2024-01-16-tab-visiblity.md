---
title: Get the focus state and the hidden state for browser tabs
tags:
  - til
  - code
---
I found it surprisingly straight forward to identify if the current browser tab has the user focus and to find out if a tab is visible. 

[`document.hasFocus()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus) will return `true` in case the document or any element inside the document has the user focus.

Browsers provide the Page Visibility API to track the visibility state: [`document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState) is a readonly property and can contain one of two string values, `hidden` or `visible`. A `hidden` state indicates the tab is currently a background tab or the window is minimized. `visible` indicates the tab content is at least partially visible. Changes of the visibility state can be observed with the [`visibilitychange`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) event. 


