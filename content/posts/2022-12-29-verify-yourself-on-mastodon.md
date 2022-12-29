---
title: Verify yourself on Mastodon
tags: journal
---
When you have a personal website, you can verify yourself on Mastodon by linking from your Mastodon profile to your personal website and by backlinking from your personal website to your Mastodon profile. The backlink (verification link) needs to have a `rel="me"` attribute. You don´t have to pay for it as on Twitter and the indication in your Mastodon profile will not be a blue checkmark but a green link to your personal site with a green checkmark in front of it.

Of course, the verification is only as credible as your personal website, and as credible as the Mastodon server your are on, because the idea is that your personal website declares trustworthiness of your Mastodon account and your Mastodon account declares the trustworthiness of your personal website.^[[<cite>How We Verified Ourselves on Mastodon — and How You Can Too</cite>](https://themarkup.org/levelup/2022/12/22/how-we-verified-ourselves-on-mastodon-and-how-you-can-too), Dan Phiffer, The Markup, Dec 22, 2022]

In your Mastodon profile you can share up to 4 meta links. One of them should point to your personal website.

<figure>
<img src="/img/mastodon/meta-links.png" alt="Screenshot of the Mastodon profile area where four meta links can be provided. This actual screenshot shares the linke to my personal website {{site.hostname}}">
<figcaption>The area in your Mastodon profile where you can provide your meta links. In this case it´s only one meta link, pointing to my personal site {{site.hostname}}</figcaption>
</figure>

The meta link section of your Mastodon profile has a sub-section labeled *Verification*, saying:

> You can verify yourself as the owner of the links in your profile metadata. For that, the linked website must contain a link back to your Mastodon profile. The link back must have a `rel="me"` attribute. The text content of the link does not matter. 

To simplify the step of linking from your personal website back to your Mastodon profile there is a button that will copy the necessary backlink into the clipboard, when clicked. The copied link is enclosed in an `a` tag, like:

```html
<a rel="me" href="https://fosstodon.org/@ulfschneider">Mastodon</a>
```

The `a` tag is useful for having the backlink visible to your users on every page of your personal website. If you do not want to make the link visible on every page, you can as well put it into the `head` section of your HTML pages with a `link` tag, like:

```html
<head>
…
<link rel="me" href="https://fosstodon.org/@ulfschneider">
…
</head>
```

You will be rewarded by your Mastodon profile showing a green meta link and a green checkmark in front of it.

<figure>
<img src="/img/mastodon/verified-green.png" alt="A screenshot of a Mastodon profile with a verified homepage link pointing from Mastodon to {{site.hostname}}">
<figcaption>Once your Mastodon account is verified through the two links pointing to each other, the meta link in your Mastodon profile that is pointing to your personal website will be colored green and prefixed with a green checkmark.</figcaption>
</figure>

