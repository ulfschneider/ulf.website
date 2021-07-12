---
title: Website evaluation tools
tags: accessibility
---
[[toc]]

## Any accessible website must 

- use semantic-, standards-based HTML,
- apply accessibility best pratices (which is a wide field), and
- be fast.

## Tools
The table below is listing tools to check a website for compliance in the named areas.

<table class="bleed">
<caption>Tools to validate a website for accessibility.</caption>
<colgroup>  
       <col style="width: 20%" />
       <col style="width: 30%" />
       <col style="width: 50%" />
</colgroup>
<tr><th>Category</th><th>Tool</th><th>Comment</th></tr>
<tr><td>HTML</td><td><a href="https://validator.w3.org/">W3C Markup Validation Service</a></td><td>Check HTML standard compliance</td></tr>
<tr><td>HTML</td><td>Switching off CSS</td><td>A good check for semantic HTML is to switch off CSS in the browser. The document should be usable and readable even without CSS attached.</td></tr>
<tr><td>Accessibility</td><td><a href="https://wave.webaim.org/"><a href="https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector">Firefox Accessibility Inspector</a></td><td>Check the entire web page for <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast">visual contrast</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Keyboard">navigation via keyboard</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Text_labels_and_names">missing text labels</a>, and visualize tabbing order. It also has a simulator that lets you see what a web page would look like to users with various forms of color vision deficiency, as well as contrast sensitivity loss.</td></tr>
<tr><td>Accessibility</td><td><a href="https://wave.webaim.org/">WebAIM WAVE</a></td><td>Check accessibility patterns</td></tr>
<tr><td>Accessibility</td><td><a href="https://webaim.org/resources/contrastchecker/">WebAIM Contrast Checker</a></td><td>Check contrast of two colors</td></tr>
<tr><td>Accessibility</td><td><a href="https://colorslurp.com">Colorslurp</a></td><td>Check contrast of two colors. Desktop tool for Mac.</td></tr>
<tr><td>Accessibility</td><td><a href="https://color.a11y.com/">Color Contrast Accessibility Validator</a></td><td>Check contrast of an entire web page</td></tr>
<tr><td>Performance</td><td><a href="https://developers.google.com/speed/pagespeed/insights/">Lighthouse PageSpeed Insights</a></td><td>Check web page performance. A Lighhouse analysis can also be started through the Chrome Developer Tools, where it is available as a dedicated top-level menu entry. This allows to analyse a website running locally on the developer machine.</td></tr>
</table>

## References
- Adam Silver, [Semantic HTML and ARIA explained](https://adamsilver.io/articles/semantic-html-and-aria-explained/)
- kulturbanause, [HTML-Elemente und Semantik](https://blog.kulturbanause.de/2008/01/html-elemente-und-semantik/)
- MDN, [Semantics](https://developer.mozilla.org/en-US/docs/Glossary/semantics)
