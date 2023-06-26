---
title: Evolution of the Jamstack
tags: code
abstract: Strategies for building Jamstack sites evolved since 2015. How is the Jamstack defined today?
---

[[toc]]

## Static rendering

A core concept of the Jamstack is static rendering, which means to take data from various sources and transfer that data into static HTML files. The static files are compiled during a build step *in advance* to prepare responses to *future user requests* ahead of time, and not at request time. A Static Site Generator (SSG) will be used to perform the build.

Such websites are very fast and sturdy. A downside of this concept can be that the static files need to be generated for *every possible URL* in advance. If you cannot say what the future URL of a page is, you cannot build it ahead of time.[^rendering]

## Content Delivery Network

Recently I saw: Jamstack means <q>capable of being served directly from a CDN.</q>[^growing-up]

A Content Delivery Network (CDN) is not a must for a website that is serving static files, but static files can perfectly be distributed via a CDN, which will power up the site with speed and reliability. Global availability at highspeed is an attribute associated with Jamstack sites, therefore I consider this a part of defining the Jamstack.

## Client-side JavaScript

Client-side Javascript is used to evaluate user requests at request time and to provide content in a more dynamic way. A simple example are the comments on a blog page. The blog pages content itself is pre-rendered as a static file, but the commenting process cannot be addressed sufficiently by static rendering. The problem can be solved with the strategy that is around since the beginning of the Jamstack: By leveraging an API that handles the dynamic creation *and* the data provisioning of comments *on demand.* That means the already existing comments will be queried with REST calls for each user who is opening a blog page.[^intersection-observer] JavaScript will render the comments dynamically on the client-side into the page. This pattern requires a service that offers the management of comments.

It´s possible to incorporate the already existing comments into the next complete build of the website and make the previously dynamic content a static rendered content. In our example this would even allow to incorporate the comments into a search index of the website for conventient search and find. Only the comments created *after* the most recent build will be dynamic content that is then treated with client-side JavaScript.

## Deferred static rendering

Another approach is to pre-render only critical pages and to defer the static rendering of uncritical pages to a point in time when a user requests the page. The Gatsby team has given this concept the name *Deferred Static Generation (DSG)*[^dsg], while Netlify coins the term *Distributed Persistent Rendering (DPR).*[^rfc-dpr]

<figure>
<img src="/img/jamstack/distributed-persistent-rendering.png">
<figcaption>Pre-render critical pages during the <em>static rendering</em> and generate additional pages on demand. The image is taken from Matt Biilmann´s article <a href="https://www.netlify.com/blog/2021/04/14/distributed-persistent-rendering-a-new-jamstack-approach-for-faster-builds/"><cite>Distributed Persistent Rendering: A new Jamstack approach for faster builds</cite></a>. I´m not sure if <em>Distributed Persistent Rendering</em> is a good term – for now I prefer <em>Deferred Static Generation</em>, as the Gatsby team calls it, or simply <em>Deferred Static Rendering</em>.</figcaption>
</figure>

Deferring the static rendering of pages serves two purposes:

1.  **Speed up the build process** by pre-rendering only the critcal pages. Uncritical pages will be built on demand at request time and from that point on served unaltered until the next full build. This makes sense for large websites with thousands of pages.
2.  **React to user input** and build a page based on input that is only available at request time and not at pre-rendering time. This also addresses the problem that some URL´s will only be known at request time and not at pre-rendering time. Again, a page that has been created based on user input will be served unchanged from that point on. It can only change with the next pre-rendering.

When a deferred page is requested for the first time after a new build of the website, the deferred page is not yet available and needs to be built before it can be delivered to the user, which will take a bit of time. After that, the page is static and serving the page is as fast as any static page. Netlify uses their *on-demand builders[^on-demand-builders]* for the deferred page generation. An on-demand builder is a *serverless function.*

The deferred static rendering should be done in a way to ensure[^rfc-dpr]:

- **Atomic deployments:** Where all of the code, assets and configuration of a site are updated at once so that a website cannot be accidentally served in a partially updated state.
- **Immutable deployments:**  Once created, an immutable deploy of a website becomes an artifact which will not change. Instead, deploys result in new versions or instances of the site, and traffic is routed to them accordingly.

For that reason, after a deferred page has been generated, it can only change with, or after, the next complete build of the website.[^keep-it-simple] Zach Leatherman´s [Rainglow demo](https://www.zachleat.com/web/rainglow/)[^rainglow] is an example of deferred static rendering with the 11ty Static Site Generator.

## Serverless functions

Similar to client-side JavaScript, serverless functions allow to react to user requests at request time. The difference is: Serverless functions are executed on the server. A fulltext search for a website could be implemented with a serverless function. While running on a server, it is called a serverless function because a developer will not recognize the server. The complexity is hidden away by the provider of the serverless computing service, like with [AWS Lambdas](https://aws.amazon.com/lambda/) and [Azure Functions](https://azure.microsoft.com/en-us/products/functions/).

## Edge Functions

Edge Functions are serverless functions *living on the edge.* Instead of being hosted on a server somewhere in the cloud, Edge Functions are executed on a server closest to the user (*on the edge of the internet*). This reduces latency and therefore increases speed. Also, Edge Functions should have a quicker cold-start because typically they use a fast starting runtime environment like [Deno](https://deno.land), which allows a faster cold start than [Node.js](https://nodejs.dev/en/), for example.

Netlify offers both, serverless functions as well as Edge Functions.[^lengstorf-edge] Each of them having certain constraints, like maximum memory consumption, execution time limits, and available programming languages.[^netlify-functions] [<cite>11ty build vs. serverless vs. edge</cite>](/2022-10-05-build-serverless-edge/) might be of use for a differentation from the perspective of Zach Leatherman´s 11ty Static Site Generator.[^11ty-build-serverless-edge]

## Defining the Jamstack

To settle on a somewhat lengthy and not super-elegant description, for now, I´d say:

> <p>The Jamstack allows to build very fast, secure, and sturdy websites because it takes data from various sources and compiles that data into static files in advance of future user requests.</p><p>The static files <em>can</em> be distributed via a Content Delivery Network to improve the website speed and reliability even more.</p><p>A faster compile process can be achieved through deferring the static rendering of certain pages until a user requests such a page. Also, deferred static rendering allows to incorporate user input into the rendering of the page, and to define the URL of the page at the first time the page is requested.</p><p>Dynamic content will be handled with REST API calls and client-side JavaScript, or with serverless functions that are executed on the server-side.</p>

I´m referring often to Netlify in this text. I think that´s because Netlify is at the heart of the Jamstack and they are heavily pushing the topic in a direction that makes sense to me (static rendering first, keeping things simple, atomic and immutable deploys).

[^rendering]: [<cite>Rendering on the Web](https://web.dev/rendering-on-the-web/) by Jason Miller and Addy Osmani, updated August 18, 2022
[^growing-up]: [<cite>Jamstack growing up](https://noti.st/philhawksworth/5Zh3rm/jamstack-growing-up), Phil Hawksworth at Jamstack Toronto, June 2021
[^intersection-observer]: Use the [<cite>Intersection Observer API</cite>](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to load the comments only when the user scrolls to that area of the page where the comments reside.
[^dsg]: [<cite>A Guide to Deferred Static Generation</cite>](https://www.gatsbyjs.com/blog/deferred-static-generation-guide/)
[^rfc-dpr]: [<cite>Request for Comments: Distributed Persistent Rendering (DPR)</cite>](https://github.com/jamstack/jamstack.org/discussions/549) for a discussion around Netlify´s Distributed Persistent Rendering , April 2021
[^on-demand-builders]: [<cite>On-demand Builders</cite>](https://docs.netlify.com/configure-builds/on-demand-builders/) are serverless functions used to generate web content as needed that’s automatically cached on Netlify’s Edge CDN.
[^atomic-and-immutable]: [<cite>Terminology explained: Atomic and immutable deploys</cite>](https://www.netlify.com/blog/2021/02/23/terminology-explained-atomic-and-immutable-deploys/)
[^keep-it-simple]: [<cite>Keeping It Simple</cite>](https://youtu.be/p-ZWytPX1fo), Mathias Biilman, CEO of Netlify, React Summit Remote Edition 2021
[^rainglow]: [<cite>Rainglow: A demo of eleventy serverless</cite>](https://www.zachleat.com/web/rainglow/), Zach Leatherman, July 2021
[^lengstorf-edge]: [<cite>Let´s learn Netlify Edge Functions</cite>](https://www.learnwithjason.dev/let-s-learn-netlify-edge-functions), a video with Jason Lengstorf
[^netlify-functions]: [<cite>Netlify Functions. Build scalable, dynamic applications</cite>](https://www.netlify.com/products/functions/)
[^11ty-build-serverless-edge]: [<cite>11ty build vs. serverless vs. edge</cite>](/2022-10-05-build-serverless-edge/) gives a differentiation from the perspective of Zach Leatherman´s 11ty Static Site Generator.
