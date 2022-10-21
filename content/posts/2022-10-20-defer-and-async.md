---
title: JavaScript defer and async
abstract: Diagrams to explain how JavaScript defer and async loading works in the browser
tags: code
---
## `<script src="script.js">`

JavaScript loading without async nor defer.

<table>
<tr><th class="normal">(1) Parsing of the HTML document starts.</th><td class="bg-primary white">Parse HTML</td><td></td><td></td></tr>
<tr><th class="normal">(2) A script tag is found while parsing the HTML. Parsing is paused and the browser downloads the script.</th><td class="bg-neutral-4"></td><td class="bg-accent-four white">Load script</td><td></td></tr>
<tr><th class="normal">(3) Once the script is downloaded by the browser the script is executed.</th><td class="bg-neutral-4"></td><td></td><td class="bg-accent-four white">Execute script</td></tr>
<tr><th class="normal">(4) The script has been executed. The browser will continue parsing HTML.</th><td class="bg-primary white">Parse HTML</td><td></td><td></td></tr>
</table>

Page contents will only show up in the browser after scripts have been loaded and executed.

## `<script async src="script.js">`

<table>
<tr><th class="normal">(1) Parsing of the HTML document starts.</th><td class="bg-primary white">Parse HTML</td><td></td><td></td></tr>
<tr><th class="normal">(2) A script tag is found while parsing the HTML. The parsing of HTML is not paused while downloading the script.</th><td class="bg-primary"></td><td class="bg-accent-four white">Load script</td><td></td></tr>
<tr><th class="normal">(3) Once the script is downloaded by the browser the script is executed and parsing of HTML is paused.</th><td class="bg-neutral-4"></td><td></td><td class="bg-accent-four white">Execute script</td></tr>
<tr><th class="normal">(4) The script has been executed. The browser will continue parsing HTML.</th><td class="bg-primary white">Parse HTML</td><td></td><td></td></tr>
</table>

`async` is ignored when the script tag does not have a `src` attribute (inline script).

Page content will show up immediately in the browser and is not blocked by loading (but by executing) the script.

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) says:

For classic scripts, if the `async` attribute is present, then the classic script will be fetched in parallel to parsing and evaluated as soon as it is available.

For module scripts, if the `async` attribute is present then the scripts and all their dependencies will be executed in the defer queue, therefore they will get fetched in parallel to parsing and evaluated as soon as they are available.

## `<script defer src="script.js">`

<table>
<tr><th class="normal">(1) Parsing of the HTML document starts.</th><td class="bg-primary white">Parse HTML</td><td></td><td></td></tr>
<tr><th class="normal">(2) A script tag is found while parsing the HTML.</th><td class="bg-primary"></td><td class="bg-accent-four white">Load script</td><td></td></tr>
<tr><th class="normal"> The parsing of HTML is not paused while downloading the script and will continue until the parsing is finished.</th><td class="bg-primary white"></td><td></td><td></td></tr>
<tr><th class="normal">(3) When the parsing of the HTML is finished and the script is downloaded the script will be executed.</th><td></td><td></td><td class="bg-accent-four white">Execute script</td></tr>
</table>

`defer` is ignored when the script tag does not have a `src` attribute (inline script).

Page content will show up immediately in the browser and is not blocked by loading nor by executing the script.

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) says:

`defer` will indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing `DOMContentLoaded`.

Scripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating.

The `defer` attribute has no effect on module scripts — they defer by default. 

Scripts with the `defer` attribute ==will execute in the order in which they appear in the document==.

## When to use what

I mostly find myself using `defer` instead of `async` and start using the deferred script within a `DOMContentLoaded` event or a `load` event. `defer` will not block the HTML parsing and is therefore speeding up the page processing but ensures the script will only be executed when the entire DOM is in place. `defer` will also execute scripts in the order of their appearance in the HTML which is important for `defer` script dependencies that need to be loaded and executed before your current script.

`async` has the potential to be even faster than `defer` because the download of the script does not block the HTML parsing and the script will immediately be executed after downloading. Whatever has not been parsed from the HTML at that point is not available to the script and `async` scripts are not guaranteed to be executed in the order of their appearence in the HTML. Therefore you cannot assume an `async` script dependency is already available only because it appears before your current script in the HTML. That limits the use of `async` to scripts that are not dependent on other scripts.

## References

- [<cite>Asynchronous vs Deferred JavaScript</cite>](https://bitsofco.de/async-vs-defer/) by Ire Aderinokun
- [<cite>async vs defer attributes</cite>](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html) by Daniel Imms
- [Scripts: async, defer](https://javascript.info/script-async-defer) on javascript.info
- [The Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) on MDN




