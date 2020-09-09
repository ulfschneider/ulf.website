---
title: Website evaluation tools
---
[[toc]]

## Requirements

Any accessible website must 

- use semantic-, standards-based HTML,
- apply accessibility best pratices (which is a wide field),
- be fast.

## How to evaluate requirements

To validate for compliance in these areas, I´m using the following tools:

<table class="breakout-r">
<caption>Tools to evaluate websites</caption>

<colgroup>
       <col style="width: 20%" />
       <col style="width: 30%" />
       <col style="width: 50%" />
</colgroup>
    
<tr><th>Category</th><th>Tool</th><th>Comment</th></tr>
<tr><td>HTML</td><td><a href="https://validator.w3.org/">W3C Markup Validation Service</a></td><td>Check HTML standard compliance</td></tr>
<tr><td>HTML</td><td>Switching off CSS</td><td>A good check for semantic HTML is to switch off CSS in the browser. The document should be usable and readable even without CSS attached.</td></tr>
<tr><td>Accessibility</td><td><a href="https://wave.webaim.org/">WebAIM WAVE</a></td><td>Check accessibility patterns</td></tr>
<tr><td>Accessibility</td><td><a href="https://webaim.org/resources/contrastchecker/">WebAIM Contrast Checker</a></td><td>Check contrast of two colors</td></tr>
<tr><td>Accessibility</td><td><a href="https://color.a11y.com/">Color Contrast Accessibility Validator</a></td><td>Check contrast of an entire web page</td></tr>
<tr><td>Performance</td><td><a href="https://developers.google.com/speed/pagespeed/insights/">Lighthouse PageSpeed Insights</a></td><td>Check web page performance. A Lighhouse analysis can also be started through the Chrome Developer Tools, where it is available as a dedicated top-level menu entry. This allows to analyse a website running locally on the developer machine.</td></tr>
</table>

## References
- Adam Silver, [Semantic HTML and ARIA explained](https://adamsilver.io/articles/semantic-html-and-aria-explained/)
- MDN, [Semantics](https://developer.mozilla.org/en-US/docs/Glossary/semantics)
