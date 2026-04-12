{% if site.ownership.email %}

**<a href="#" class="oml">e-mail</a>**
: <span id="m" class="oma"></span> {% include "copy.html" copyId: "copy-m" copyContentId: "m" %}

{% endif %}
{% if site.rss.url %}

**[RSS]({{site.rss.url}}){type="application/rss+xml"}**
: {{site.rss.url}} {% include "copy.html" copyId: "rss" copyText: site.rss.url %}

{% endif %}
