---
title: Yellow Lab Tools
tags: code
---
Investigate performance issues of websites with [<cite>Yellow Lab Tools</cite>](https://yellowlab.tools), an open source tool by [Gaël Métais](https://letstalkaboutwebperf.com/en/). The tool is based on [phantomas](https://github.com/macbre/phantomas).

Whenever I encounter this kind of tool I cannot resist and point it to my blog to see the results. I learned my web fonts have unused Unicode ranges that should be eliminated from the font files:

> <strong>Unused Unicode ranges</strong>
> Warning: This rule reached the abnormality threshold, which means there is a real problem you should care about.
>
> This metric counts the number of unused Unicode ranges inside each font. For example, one font could include Cyrillic glyphs but none of them are used on the page.
>
> It also reveals the number of ligatures (letters that are represented differently when close to each other) and hidden chars (glyphs not linked to the unicode system that can't be displayed on the web).
> <footer>Yellow Lab Tools</footer>
