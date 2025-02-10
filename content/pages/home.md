---
permalink: /
layout: default
showTitle: false
topics:
  - title: Web
    urls:
      - /2024-07-20-prerender-pages/
      - /2022-09-28-jamstack-in-20-minutes/
      - /2024-04-26-pagefind/
      - /2023-01-24-my-first-attempt-with-tailwind-css/
      - /2023-08-01-serverless/
      - /2024-03-15-toggles-suck/
      - /2020-08-21-my-approach-to-accessibility/
      - /2024-10-28-responsive-tablist/
      - /2023-12-29-styling-check-boxes-and-radio-buttons/
  - title: Agile
    urls:
      - /2024-01-21-serious-play/
      - /2023-05-17-agile-ia-presenter/
      - /2015-07-24-supersize/
      - /2017-02-26-balanced-organization/
      - /2023-12-23-half-arsed-agile/
      - /2023-06-29-the-lost-interview/
  - title: Emil´s drawings
    urls:
      - /2021-10-22-a-smiling-unicorn-with-a-kite/
      - /2020-03-18-emil-pictured-the-coronavirus/
      - /2021-08-15-the-stripling-man/
      - /2024-07-07-fish/
      - /2024-01-18-dragon/
      - /2024-10-20-boiling-eggs/
  - title: Bike
    urls:
      - /2024-09-14-strael-morph/
      - /2023-10-31-autumn-riding/
      - /2024-08-06-klean-kanteen/
---

Hello, I´m Ulf Schneider, a software developer and agile coach. This is my website. If you like, here is some more information [about me](/about/).

## Recent notes

<div class="my-lg">
{% include "post-list.html" posts: collections.recentNotes stream: true%}
</div>

<a href="/blog/" class="tag button">All posts {% include "key.html" key: site.nav.blog path: "/blog/" %}</a>

## Selected posts

{% include "topics.html" topics: topics %}
