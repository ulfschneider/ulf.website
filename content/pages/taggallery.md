---
layout: gallery
pagination:
  data: collections
  size: 1
  alias: tag
permalink: "{{site.gallery}}{{ tag }}/"
id: blog
nosearch: true
---

{{collections.tagIntros | tagIntro: tag }}
