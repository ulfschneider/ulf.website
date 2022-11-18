---
title: What´s my DNS?
tags: journal
---
Today I was [delegating](https://docs.netlify.com/domains-https/netlify-dns/delegate-to-netlify/) DNS adminstration for {{site.name}} from Strato to [Netlify](https://www.netlify.com). During the process I needed to know what´s my DNS MX value and I couldn´t read it from the Strato settings because Strato was only saying <q>Strato Mailserver.</q>
A call to [<cite>whatsmydns.net/dns-lookup/</cite>](https://www.whatsmydns.net/dns-lookup/) revealed, the Strato mail server setting is:

<table class="no-so">
<tr><th>Record</th><th>Type</th><th>Priority</th><th>Target</th><th>TTL</th></tr>
<tr><td>ulf.codes</td><td>MX</td><td>5</td><td>smtpin.rzone.de</td><td>150</td></tr>
</table>

Using Netlify name servers for my personal site, which is hosted by Netlify, is a *huge* performance booster. Measured in my current environment, the times for a complete page load improved from 120 ms to 66 ms!  Also the load times on a global scale are now lightning fast. You can verify that by navigating to [testmysite.io](https://testmysite.io/) and keying in {{site.name}}. 



