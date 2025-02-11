---
title: JavaScript defer and async
abstract: Diagrams to explain how JavaScript defer and async loading works in the browser
tags: code
---
[[toc]]

## script

`<script src="script.js">`

<table>
<tr><td>(1) Parsing of the HTML document starts.</td><td class="bg-blue text-white">Parse HTML</td><td></td><td></td></tr>
<tr><td>(2) A script tag is found while parsing the HTML. Parsing is paused and the browser downloads the script.</td><td class="bg-orange text-white">Pause HTML parsing</td><td class="bg-orange text-white">Load script</td><td></td></tr>
<tr><td>(3) Once the script is downloaded by the browser the script is executed.</td><td class="bg-orange text-white"></td><td></td><td class="bg-orange text-white">Execute script</td></tr>
<tr><td>(4) The script has been executed. The browser will continue parsing HTML.</td><td class="bg-blue text-white">Parse HTML</td><td></td><td></td></tr>
</table>

Page contents will only show up in the browser after scripts have been loaded and executed.

## script async

`<script async src="script.js">`

<table>
<tr><td>(1) Parsing of the HTML document starts.</td><td class="bg-blue text-white">Parse HTML</td><td></td><td></td></tr>
<tr><td>(2) A script tag is found while parsing the HTML. The parsing of HTML is not paused while downloading the script.</td><td class="bg-blue text-white"></td><td class="bg-blue text-white">Load script</td><td></td></tr>
<tr><td>(3) Once the script is downloaded by the browser the script is executed and parsing of HTML is paused.</td><td class="bg-orange text-white">Pause HTML parsing</td><td></td><td class="bg-orange text-white">Execute script</td></tr>
<tr><td>(4) The script has been executed. The browser will continue parsing HTML.</td><td class="bg-blue text-white">Parse HTML</td><td></td><td></td></tr>
</table>

`async` is ignored when the script tag does not have a `src` attribute (inline script).

Page contents will show up immediately in the browser and HTML parsing is not blocked by loading (but by executing) the script.

`async` scripts load in the background and run when ready. The DOM and other scripts don’t wait for them, and they don’t wait for anything. A fully independent script that runs when loaded.[^javascript.info]

For classic scripts, if the `async` attribute is present, then the classic script will be fetched in parallel to parsing and evaluated as soon as it is available. For module scripts, if the `async` attribute is present then the scripts and all their dependencies will be executed in the defer queue, therefore they will get fetched in parallel to parsing and evaluated as soon as they are available. [^mdn]

## script defer

`<script defer src="script.js">`

<table>
<tr><td>(1) Parsing of the HTML document starts.</td><td class="bg-blue text-white">Parse HTML</td><td></td><td></td></tr>
<tr><td>(2) A script tag is found while parsing the HTML. The parsing of HTML is not paused while downloading the script and will continue until the parsing is finished.</td><td class="bg-blue text-white"></td><td class="bg-blue text-white">Load script</td><td></td></tr>
<tr><td>(3) When the parsing of the HTML is finished and the script is downloaded the script will be executed.</td><td></td><td></td><td class="bg-orange text-white">Execute script</td></tr>
</table>

`defer` is ignored when the script tag does not have a `src` attribute (inline script).

Page contents will show up immediately in the browser and HTML parsing is not blocked by loading nor by executing the script.

`defer` will indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing `DOMContentLoaded`. Scripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating. The `defer` attribute has no effect on module scripts — they defer by default.[^mdn]

Scripts with the `defer` attribute ==will execute in the order in which they appear in the document==.

## When to use what

I mostly find myself using `defer` instead of `async` and begin accessing the deferred script within a `DOMContentLoaded` event or a `load` event. `defer` will not block the HTML parsing and is therefore speeding up the page processing but ensures the script will only be executed when the entire DOM is in place. `defer` will execute scripts in the order of their appearance in the HTML which is important for script dependencies that need to be available in a certain order.

`async` has the potential to be even faster than `defer` because the download of the script does not block the HTML parsing (same as `defer`) and the script will immediately be executed after downloading (unlike `defer`). Whatever has not been parsed from the HTML at that point is not available to the script. `async` scripts are not guaranteed to be executed in the order of their appearence in the HTML. Therefore you cannot assume an `async` script dependency is available only because it appears before your current script in the HTML. That limits the use of `async` to scripts that are not dependent on other scripts.

The articles by Ire Aderinokun[^aderinokun] and Daniel Imms[^imms] influenced the diagrams shown in this article.


[^aderinokun]:
	[<cite>Asynchronous vs Deferred JavaScript</cite>](https://bitsofco.de/async-vs-defer/) by Ire Aderinokun
[^imms]:
	[<cite>async vs defer attributes</cite>](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html) by Daniel Imms
[^javascript.info]:
	[<cite>Scripts: async, defer</cite>](https://javascript.info/script-async-defer) on javascript.info
[^mdn]:
	[<cite>The Script element</cite>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) on MDN
