---
title: What´s my DNS?
tags: journal
---
Today I was delegating my DNS adminstration from Strato to Netlify. During the process I needed to know what´s my DNS MX value and I couldn´t read it from the Strato settings because Strato was only saying <q>Strato Mailserver.</q>
A call to [<cite>whatsmydns.net/dns-lookup/</cite>](https://www.whatsmydns.net/dns-lookup/) revealed, the Strato mail server setting is:

<table class="no-so">
<tr><th>Record</th><th>Type</th><th>Priority</th><th>Target</th><th>TTL</th></tr>
<tr><td>ulf.codes</td><td>MX</td><td>5</td><td>smtpin.rzone.de</td><td>150</td></tr>
</table>


