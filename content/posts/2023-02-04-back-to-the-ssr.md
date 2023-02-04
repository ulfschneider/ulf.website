---
title: Back to the SSR
tags: code
---
The Deno blog entry [<cite>Back to the SSR</cite>](https://deno.com/blog/the-future-and-past-is-server-side-rendering) is touching important points: website size, speed, and robustness. I became more aware of Deno because [Netlify is running their edge functions in Deno](https://www.netlify.com/blog/announcing-serverless-compute-with-edge-functions/), and because the Shop Talk Show has an interesting talk with Ryan Dahl in its episode [<cite>546: Ryan Dahl and Deno</cite>](https://shoptalkshow.com/546/). Ryan previously invented the Node.js project, and  now he is with Deno on his second big invention project. What´s going on with Deno needs attention, in my view.

Quick notes form the blog article:

> -  In the past 10 years, the [median size for a desktop webpage](https://almanac.httparchive.org/en/2021/page-weight) has gone from 468 KB to 2284 KB, a 388.3% increase. 
> -  For mobile, this jump is even more staggering — 145 KB to 2010 KB — a whopping 1288.1% increase.
> - We're building complex apps for every screen size and every bandwidth. People might be using your site on a train in a tunnel. The best way to ensure a consistent experience across all these scenarios, while keeping your code base small and easy to reason about is SSR (Server-Side Rendering).
> - Performant frameworks that care about user experience will send exactly what's needed to the client, and nothing more. To minimize latency even more, deploy your SSR apps [close to your users at the edge](https://deno.com/blog/the-future-of-web-is-on-the-edge). You can do all of this today with [Fresh](https://fresh.deno.dev) and [Deno Deploy](https://deno.com/deploy).

Whenever possible, I prefer SSR over Single Page Apps. Also, Edge makes sense to me.^[I have written about that in [<cite>Jamstack in 20 minutes</cite>](https://ulfschneider.io/2022-09-28-jamstack-in-20-minutes/) and [<cite>Evolution of the Jamstack</cite>](https://ulfschneider.io/2022-12-25-evolution-of-the-jamstack/).] You can have all of that without the Fresh framework, but because the Deno folks for sure know what they are doing, it will be interesting to follow their activities.
