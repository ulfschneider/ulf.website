---
title: Evolution of the Jamstack
tags: code
draft: true
---
Initialy, the term JAMStack stood for JavaScript, Markup, and API. That was correct but didn´t really explain the underlying processing model. 

Somehow along the way the capital letters disappeared and the JAMStack morphed into the Jamstack. A further – complementing – definition became: *The Jamstack takes data from various sources and transfers that data into static files.* That touches a key aspect of the Jamstack, in my view. Another key aspect is to *compile* the static files out of the data *in advance,* which is also called pre-rendering, or building, and serves the purpose to generate the responses to future user requests in advance *and not at request time.* Pre-rendering will make the website fast and sturdy. This is called **Static Rendering, or Static Site Generation (SSG)**.

Recently, in one of the [talks of Phil Hawksworth](https://noti.st/philhawksworth/5Zh3rm/jamstack-growing-up), I saw: *Jamstack means [to be] capable of being served directly from a CDN.* A Content Delivery Network (CDN) is not a must for a site that is serving static files, but static files can perfectly be distributed via a CDN, which will power up the site with speed and reliability. Global availability at highspeed is an attribute associated with Jamstack sites, therefore I consider this a part of defining the Jamstack.

I also see: *The Jamstacks decouples the frontend from the backend because front-end is no longer limited to be a product of the backend system.* I´m not sure if that helps to understand the Jamstack –
 I think that definition is too generic.

Then there is the demand for user generated content, which means the necessity to evaluate user requests at request time, and to provide content in a more dynamic way. A simple example would be the comments on a blog page. The blog entry itself is pre-rendered but pre-rendering the comments is not the answer in this case. The problem can be solved with the Jamstack pattern that is around since the beginning, by leveraging an API that handles the dynamic creation *and* the data provisioning of comments *on demand.* That means the comments will be queried with REST calls for each user who is opening a blog page that has comments attached to it. JavaScript will render the comments dynamically on the client into the page. This pattern requires a service that offers the management of comments. [Utterances](https://utteranc.es/) is an example of leveraging GitHub issues to handle comments for Jamstack blogs dynamically. This is **Client Side Rendering (CSR) with pre-rendered pages**.

A different approach could be to build the blog page 


Then we got *serverless functions* to react to user requests at runtime (request time) and to provide content in a more dynamic way.
Static Site Genration (SSG)
Incremental Static Regeneration (ISR)
Distributed Persistent Rendering (DPR)
Deferred Statig Generation (DSR)

If I should summarize it for now, I´d say:

> The Jamstack takes data from various sources and compiles that data into static files in advance. Those static files *can* be distributed via a Content Delivery Network for speed and reliability. Content rendering at request time will be accomplished with either REST API calls and JavaScript, or by rendering  

The advantages are:

- Security
- Speed
- Scalability
- Immutable (atomic) deploys




https://css-tricks.com/distributed-persistent-rendering-dpr/
https://github.com/jamstack/jamstack.org/discussions/549
https://bejamas.io/blog/understanding-rendering-in-the-jamstack/ 
https://jamstack.org/glossary/dpr/
https://www.bram.us/2021/12/16/understanding-rendering-in-the-jamstack-ssg-isr-dpr-dsg/
https://www.smashingmagazine.com/2021/07/isr-dpr-explained/
https://web.dev/rendering-on-the-web/ 
https://www.toptal.com/front-end/client-side-vs-server-side-pre-rendering