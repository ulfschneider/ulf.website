---
title: testmysite.io
tags: journal
---
[<cite>testmysite.io</cite>](https://testmysite.io/) is a website speed test tool by Netlify that measures site performance for different locations:

- San Francisco
- New York
- Frankfurt
- Sao Paulo
- Sidney
- Tokio

The results for my site are:

<figure>
<img src="/img/journal/2022-09-04-site-speed-ulf-codes.png">
<figcaption>Site speed results for {{site.name}} as of 04 Sep, 2022</figcaption>
</figure>

The tool will give hints for possible improvements. In my case it is:

> Your site is on Netlify, but you’re not taking full advantage of our global content delivery network.
	You should always link your domain to Netlify with a CNAME record when possible, and avoid using an A record with a single IP.
	A CNAME will let Netlify direct the user to the closest CDN point of presence, which improves performance by an order of magnitude.
	Most DNS providers won’t allow CNAME records for a “naked domain”, since this is not well supported by the DNS spec.
	If you stay with a DNS provider that requires an A record on the naked domain, we recommend that you use the www domain as your primary address.
		
Because of this kind of recommendation I think [testmysite.io](https://testmysite.io) complements the well known [Google Lighthouse](https://pagespeed.web.dev/) test very well.