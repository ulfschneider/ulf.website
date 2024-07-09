---
title: New Set methods
tags:
  - code
  - til
---
I'm pleased to learn there are [<cite>New JavaScript Set methods</cite>](https://developer.mozilla.org/en-US/blog/javascript-set-methods/), as described by Brian Smith on MDN. Node is supporting it with version 22.0.0 (which is to modern for what I´m doing in a current project with Serverless Azure Functions). The Browsers are also supporting it (but Firefox only since [version 127](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/127#javascript), which was released 11 Jun, 2024. I think that is as well too modern to use it right now). 

> `intersection()` returns a new set with elements in both this set and the given set.
> `union()` returns a new set with all elements in this set and the given set.
> `difference()` returns a new set with elements in this set but not in the given set.
> `symmetricDifference()` returns a new set with elements in either set, but not in both.
> `isSubsetOf()` returns a boolean indicating if all elements of a set are in a specific set.
> `isSupersetOf()` returns a boolean indicating if all elements of a set are in a specific set.
> `isDisjointFrom()` returns a boolean indicating if this set has no elements in common with a specific set.
> <footer><a href="https://developer.mozilla.org/en-US/blog/javascript-set-methods/"><cite>New JavaScript Set methods</cite></a>, Brian Smith, MDN</footer>