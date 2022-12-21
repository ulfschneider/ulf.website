---
title: Evolution of the Jamstack
tags: code
draft: true
---
Initialy, the term JAMStack stood for JavaScript, Markup, and API. That was correct but didn´t really explain the underlying processing model. 

Somehow along the way the capital letters disappeared and the JAMStack morphed into Jamstack. A further – complementing definition – became: *The Jamstack takes data from various sources and transfers that data into static files.* That touches a key aspect of the Jamstack, in my view. Another key aspect is to *compile* the static files out of the data *in advance,* which can also be called pre-rendering, or building, and serves the purpose to generate the responses to future user requests in advance and not at runtime. Pre-rendering will make the application fast and sturdy.

Recently, in one of the [talks of Phil Hawksworth](https://noti.st/philhawksworth/5Zh3rm/jamstack-growing-up), I saw: *Jamstack means [to be] capable of being served directly from a CDN.* Though, a CDN is not a must for a site that is serving static files, but the static files can perfectly be disseminated via a Content Delivery Network, which will power up the site with speed and reliability. Global availability at highspeed is an attribute associated with a Jamstack site.

I also see: *The Jamstacks decouples the frontend from the backend because front-end is no longer limited to be a product of the backend system.* I´m not sure if that helps to understand the Jamstack – with my current understanding, I think that definition is too generic.

Then we got *serverless functions* to react to user requests at runtime (request time) and to provide content in a more dynamic way.
Static Site Genration (SSG)
Incremental Static Regeneration (ISR)
Distributed Persistent Rendering (DPR)
Deferred Statig Generation (DSR)

If I should summarize it for now, I´d say:

> The Jamstack takes data from various sources and compiles that data into static files in advance. Those static files allow to be disseminated via a CDN. 

The advantages are:

- Security
- Speed
- Scalability
- Developer experience