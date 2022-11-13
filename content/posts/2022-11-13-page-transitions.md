---
title: View transitions
tags: [css, code]
abstract: Transition between server-side rendered pages without using JavaScript
---


The [View Transitions API](https://www.w3.org/TR/css-view-transitions-1/) is available as a first public working draft. The purpose of the API is to allow transitions between the loading of pages of a website – for Single Page Apps (SPA) as well as for Multi Page Apps (MPA). Smooth transitions for loading pages would allow a traditional website to be perceived very much like a native app and would improve how a user perceives the website logic. It´s a great improvement in my view but it is impossible to do it properly today, especially for MPAs. Once fully available, the API would allow transitioning between server-side rendered pages without using any JavaScript.

A first implementation of the API is available in Chrome 104+ behind the feature flag [chrome://flags/#document-transition](chrome://flags/#document-transition). Maxi Ferreira made an excellent example of its usage: [<cite>Experiments with Astro and the Shared Element Transition API</cite>](https://www.maxiferreira.com/blog/astro-page-transitions/).

When you jump to Maxi´s [Room For Improvement](https://www.maxiferreira.com/blog/astro-page-transitions/#room-for-improvement) section you find there is still some work to do. So much so, that unfortunately for now I´m not going to invest time into that. But once it´s stable, I think it will quickly turn into a *must-have* for websites.

There is more material by Jake Archibald with his article [<cite>Smooth and simple page transitions with the shared element transition API</cite>](https://developer.chrome.com/blog/shared-element-transitions-for-spas/), and the below video:

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/JCJUPJ_zDQ4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<figcaption><cite>Bringing page transitions to the web</cite>, Jake Archibald on <a href="https://www.youtube.com/watch?v=JCJUPJ_zDQ4">YouTube</a></figcaption>
</figure>
