---
title: Evolution of the Jamstack
tags: code
draft: true
abstract: Initialy, the term JAMStack stood for JavaScript, Markup, and API. That was correct but didn´t really explain the underlying processing model. The strategies for building Jamstack sites evolved since 2015 and so did the naming of strategies. 
---

[[toc]]

## Static Site Generation (SSG)

Somehow along the way the capital letters disappeared and the JAMStack morphed into the Jamstack. A further – complementing – definition became: <q>The Jamstack takes data from various sources and transfers that data into static files.</q> That touches the core aspect of the Jamstack, in my view. Another key aspect is to *compile* the static files out of the data *in advance,* which is also called pre-rendering, or building, and serves the purpose to generate the responses to future user requests in advance *and not at request time.* Pre-rendering will make the website fast and sturdy and is also something I would say is core for the Jamstack. The pre-rendering of the website is called **Static Site Generation (SSG)**.

## Content Delivery Network (CDN)

Recently, in one of the [talks of Phil Hawksworth](https://noti.st/philhawksworth/5Zh3rm/jamstack-growing-up), I saw: <q>Jamstack means [to be] capable of being served directly from a CDN.</q> A Content Delivery Network (CDN) is not a must for a site that is serving static files, but static files can perfectly be distributed via a CDN, which will power up the site with speed and reliability. Global availability at highspeed is an attribute associated with Jamstack sites, therefore I consider this a part of defining the Jamstack.

## Client-side Rendering (CSR)

When there is the demand for user generated content, which means the necessity to evaluate user requests at request time to provide content in a more dynamic way, the Static Site Generation is not sufficient anymore. A simple example such a use case can be the comments on a blog page. The blog page itself is pre-rendered, but pre-rendering the comments is not the answer when a user is taking part in a discussion by creating a new comment. The problem can be solved with the strategy that is around since the beginning of the Jamstack: By leveraging an API that handles the dynamic creation *and* the data provisioning of comments *on demand.* That means the comments will be queried with REST calls for each user who is opening a blog page. JavaScript will render the comments dynamically on the client into the page. This pattern requires a service that offers the management of comments. The strategy can be described as **Static Site Generation (SSG), enhanced by Client-side Rendering (CSR)**. It´s possible to incorporate the dynamic content into the next complete build of the website and make the previously dynamic content a static content. In our example this would even allow to incorporate the comments into a search index of the website for conventient search and find. Only the comments created *after* the most recent build will be dynamic content that is then treated with Client-side rendering.

## Deferred Static Generation (DSG)

Another approach is to pre-render only critical pages and to defer the static generation of uncritical pages to a point in time when a user requests the page. Actually, the term *Deferred Static Generation*[^dsg] is the name given by the Gatsby team to the concept, and I think it´s a good name. Netlify coins the different term *Distributed Persistent Rendering* for the same concept[^rfc-dpr].

<figure>
<img src="/img/jamstack/distributed-persistent-rendering.png">
<figcaption>Pre-render critical pages during the <em>Static Site Generation</em> and generate additional pages on demand. The image is taken from Matt Biilmann´s article <a href="https://www.netlify.com/blog/2021/04/14/distributed-persistent-rendering-a-new-jamstack-approach-for-faster-builds/"><cite>Distributed Persistent Rendering: A new Jamstack approach for faster builds</cite></a>. I´m not sure if <em>Distributed Persistent Rendering</em> is a good term – for now I prefer <em>Deferred Static Generation.</em></figcaption>
</figure>

Deferring the static generation of pages serves the two purposes:

1.  **Speed up the pre-rendering** by pre-rendering only the critcal pages. Uncritical pages will be build on user demand and from that point on served unaltered until the next pre-rendering. This makes sense for large websites with thousands of pages.
2.  **React to user input** and build a page based on input that would only be available at request time and not at pre-rendering time. Again, a page that has been created based on user input will be served unchanged from that point on. It can only change with the next pre-rendering.

When a deferred page is requested for the first time after a new deployment, the page is not yet available and needs to be built before it is delivered to the user. The deferred building will take a bit of time. After that, serving the page is as fast as any static page. Netlify uses their so called *On-demand Builders[^on-demand-builders]* – which are *Serverless Functions* – for the deferred page generation. 

The Deferred Static Generation should be done in a way to ensure:

- **Atomic deployments** which ensure updates of the site are available only when they are complete and totally in place.
- **Immutable deployments** which guarantee the integrity of previous deploys by insulating them from future actions.

For that reason, after a deferred page has been generated, it can only change with or after the next complete pre-rendering of the website.[^atomic-and-immutable][^keep-it-simple]

## Defining the Jamstack

To settle on a somewhat lengthy and not super-elegant description for now, I´d say:

> <p>The Jamstack takes data from various sources and compiles that data into static files in advance (SSG). SSG is a simple processing model that creates fast, scalable, and robust websites. The static files <em>can</em> be distributed via a Content Delivery Network (CDN) for speed and reliability. A faster pre-rendering can be achieved through Deferred Static Generation (DSG) of certain pages at a point in time when a user requests such a page.</p><p>Dynamic content will be handled with REST API calls, JavaScript, and Client-side Rendering (CSR), as well as by Deferred Static Generation (DSG) that incorporates user input to render and serve a static page.</p>

I´m referring a lot to Netlify in this text. I think that´s because Netlify is at the heart of the Jamstack and they are heavily pushing the topic in a direction that makes sense to me.



https://css-tricks.com/distributed-persistent-rendering-dpr/

https://bejamas.io/blog/understanding-rendering-in-the-jamstack/ 
https://jamstack.org/glossary/dpr/
https://www.bram.us/2021/12/16/understanding-rendering-in-the-jamstack-ssg-isr-dpr-dsg/
https://www.smashingmagazine.com/2021/07/isr-dpr-explained/
https://web.dev/rendering-on-the-web/ 
https://www.toptal.com/front-end/client-side-vs-server-side-pre-rendering

https://bryanlrobinson.com/blog/creating-a-dynamic-color-converter-with-11ty-serverless/

[^dsg]: [<cite>A Guide to Deferred Static Generation</cite>](https://www.gatsbyjs.com/blog/deferred-static-generation-guide/)
[^rfc-dpr]: [Request for Comments](https://github.com/jamstack/jamstack.org/discussions/549) for a Discussion around Netlify´s Distributed Persistent Rendering 
[^on-demand-builders]: [<cite>On-demand Builders</cite>](https://docs.netlify.com/configure-builds/on-demand-builders/) are serverless functions used to generate web content as needed that’s automatically cached on Netlify’s Edge CDN
[^atomic-and-immutable]: [<cite>Terminology explained: Atomic and immutable deploys</cite>](https://www.netlify.com/blog/2021/02/23/terminology-explained-atomic-and-immutable-deploys/)#
[^keep-it-simple]: [<cite>Keeping It Simple</cite>](https://youtu.be/p-ZWytPX1fo), Mathias Biilman, CEO of Netlify, React Summit Remote Edition 2021
[^rinaldi]:[Understanding Rendering in the Jamstack](https://bejamas.io/blog/understanding-rendering-in-the-jamstack/), by Brian Rinaldi is a great round up on the topic of rendering in the Jamstack
