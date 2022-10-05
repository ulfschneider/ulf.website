---
title: 11ty build vs. serverless vs. edge
tags: code
---
Zach explains the difference of build, serverless, and edge for 11ty rendering modes. Video is taken from [<cite>ELEVENTY: BUILD VS. SERVERLESS VS. EDGE</cite>](https://www.zachleat.com/web/eleventy-rendering-modes/) where Zach´s slidedeck is also available.

11ty is a build-first, static-first tool – serverless and edge are to *supplement* the build of 11ty. Static-first should keep everything as fast and as portable as possible for 11ty.

- Everything starts with the *build,* where data is taken from different sources to create static files. The output of the build is fastest to use, most portable, simplest to host. 
- [*Serverless*](https://www.11ty.dev/docs/plugins/serverless/) allows to build pages *on request* when the site is already online. A little bit more risk, a little bit slower. Serverless can be Netlify functions, which run on every request and take at least 100 ms, or on-demand builders, which run on the first request and are cached for very fast subsequent requests. Install 11ty 1.0 to use serverless functions.
- [*Edge*](https://www.11ty.dev/docs/plugins/edge/) allows to run dynamic code on an edge server. It´s much faster than the previous serverless rendering, user personalized, and not cached at all. It replaces *some* use cases of serverless. Install 11ty 2.0 to use edge functions.

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/40yPK3EKE60" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>

<blockquote>Netlify Edge Functions are built on Deno, an open source, standards-based runtime, which means it works out-of-the-box with web frameworks that support these capabilities. Deno does not use Node modules, or support Node APIs, but instead can load modules directly from URLs. 
<footer>from: <a href="https://www.netlify.com/blog/edge-functions-explained/"><cite>Understanding Edge Functions: The Edge and Beyond</cite></a></footer>
</blockquote>

Edge functions differ from serverless functions in the following way:

<blockquote>
Edge Functions allow you to serve content from the CDN server closest to the user. The region closest to the request will run the function. The immediate benefits that are associated with edge functions include, but are not limited to:
<ul>
<li><strong>Decreased latency:</strong> Running logic closer to the end user can reduce not only the volume of data, but the distance that data needs to travel. If a user were sending a request in Arizona, a response time from a local node would be lower than one in London.</li>
<li><strong>Reduction in cold start boot times:</strong> For serverless functions, cold start boot times average anywhere from 50-500ms. Take into consideration, research shows that the new standard for 2022 for the time an online shopper will wait for your page to load is 2-3 seconds. The cold start average for edge functions, on the other hand, is drastically reduced (50-200ms).</li>
</ul>
<footer>from: <a href="https://www.netlify.com/blog/edge-functions-explained/"><cite>Understanding Edge Functions: The Edge and Beyond</cite></a></footer>
</blockquote>
