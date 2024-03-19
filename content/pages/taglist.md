---
layout: list
pagination:
  data: collections.doublePagination
  size: 1
  alias: pagedItems
permalink: "{{pagedItems.permalink}}"
id: blog
nosearch: true
---

{{collections.tagIntros | tagIntro: pagedItems.tag }}
