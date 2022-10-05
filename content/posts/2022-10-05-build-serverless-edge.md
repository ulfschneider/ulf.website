---
title: 11ty build vs. serverless vs. edge
tags: code
---
Zach explains the difference of build, serverless, and edge for 11ty rendering modes. Video is taken from [<cite>ELEVENTY: BUILD VS. SERVERLESS VS. EDGE</cite>](https://www.zachleat.com/web/eleventy-rendering-modes/) where Zach´s slidedeck is also available.

11ty a build-first, static-first tool – serverless and edge are to *supplement* the build of 11ty. Static-first should keep everything as fast as possible and as portable as possible for 11ty.

- Everything starts with the *build,* where data is taken from different sources to create static files. The output of the build is fastest to use, most portable, simplest to host. 
- [*Serverless*](https://www.11ty.dev/docs/plugins/serverless/) allows to build pages *on request* when the site is already online. A little bit more risk, a little bit slower. Serverless can be Netlify functions, which run on every request and take at least 100 ms, or on-demand builders, which run on the first request and are cached for very fast subsequent requests. Install 11ty 1.0 to use serverless functions.
- [*Edge*](https://www.11ty.dev/docs/plugins/edge/) allows to run dynamic code on an edge server. It´s much faster than the previous serverless rendering (at max 50 ms), user personalized, and not cached at all. It replaces *some* use cases of serverless. Install 11ty 2.0 to use edge functions.

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/40yPK3EKE60" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>