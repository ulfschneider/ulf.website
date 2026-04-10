{% if site.ownership.email %}

**<a href="#" class="m-link">e-mail</a>**
: <span id="m" class="m"></span> {% include "copy.html" copyId: "mail" copyContentId: "m" %}

{% endif %}
{% if site.rss.url %}

**[RSS]({{site.rss.url}}){type="application/rss+xml"}**
: {{site.rss.url}} {% include "copy.html" copyId: "rss" copyText: site.rss.url %}

{% endif %}
