---
title: What´s my DNS?
tags: journal
---
Today I was [delegating](https://docs.netlify.com/domains-https/netlify-dns/delegate-to-netlify/) DNS adminstration for ulf.codes from Strato to [Netlify](https://www.netlify.com). During the process I needed to know what´s my DNS MX value and I couldn´t read it from the Strato settings because Strato was only saying <q>Strato Mailserver.</q>
A call of [<cite>whatsmydns.net/dns-lookup/</cite>](https://www.whatsmydns.net/dns-lookup/) for {{site.name}} revealed, the Strato mail server setting is:

<table>
<tr><th>Record</th><th>Type</th><th>Priority</th><th>Target</th><th>TTL</th></tr>
<tr><td>ulf.codes</td><td>MX</td><td>5</td><td>smtpin.rzone.de</td><td>150</td></tr>
</table>

Using Netlify name servers for my personal site, which is hosted by Netlify, is a *huge* performance booster. Measured in my current environment, the times for a page load improved from 1.2 s down to 0.6 s! I´m measuring with the [PerformanceNavigationTiming API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming) the `loadEventStart`, which is <q>representing the time value equal to the time immediately before the load event of the current document is fired.</q>

Also the load times on a global scale are now lightning fast. You can verify that by navigating to [testmysite.io for ulf.codes](https://testmysite.io/637a79d4ccca0b63641bb7ed/ulf.codes).


