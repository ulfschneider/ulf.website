{% if site.ownership.email %}

**[e-mail](mailto:{{site.ownership.email}})**
: {{site.ownership.email}} {% include "copy.html" copyId: "email" copyText: site.ownership.email %}

{% endif %}
{% if site.rss.url %}

**[RSS]({{site.rss.url}}){type="application/rss+xml"}**
: {{site.rss.url}} {% include "copy.html" copyId: "rss" copyText: site.rss.url %}

{% endif %}
