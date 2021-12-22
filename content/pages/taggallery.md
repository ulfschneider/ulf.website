---
layout: gallery
pagination:
  data: collections
  size: 1
  alias: tag
permalink: '{{site.images}}{{ tag }}/'
id: blog
bleed: '{{bleed}}'
outline: '{{outline}}'
nosearch: true
title: Images
---
{{collections.liveContent | tagIntro: tag }}