---
title: An RSS feed for GitHub Pages
---

RSS is a good thing. It simplifies to overview information that is produced by potentially many different sources. If someone has an RSS feed on her blog, you can easily subscribe to that feed and have all her published contents in your RSS reader – along with the published contents of other creators. There is also a privacy advantage. You don´t have to provide your mail address to subscribe.

I´m building my blog with Jekyll, and hosting it via GitHub Pages. Out of the box, Jekyll doesn´t have RSS feed support. One way to publish a feed is to use the <code>jekyll-feed</code> plugin, which is supported by GitHub Pages. You only need to activate it in your <code>\_config.yml</code>:

<figure>
<figcaption>_config.yml</figcaption>
{% highlight yml %}
plugins:
  – jekyll-feed
{% endhighlight %}
</figure>

Once Jekyll rebuilds your site with the plugin activated, your RSS feed is available under the URL path <code>/feed.xml/</code>.

## Limitations of jekyll-feed

However, <code>jekyll-feed</code> has some limitations:

- It makes all pages and posts available in your feed. You cannot exclude anything, or have different feeds, like for links, a reading list, and maybe your journal.
- Even posts that have a front matter setting of <code>published: no</code> are immediately visible in your feed.
- I´m referencing things inside of my blog with relative URLs. E.g., <code>/tools</code>, or <code>/images/we-are-riding-the-bullitt.jpg</code>. Those relative links remain so in your feed. But a relative link doesn´t work inside of an RSS reader, which means an image is not displayed or a link to an article is not functioning. In the RSS reader, you need absolute URLs.

## My own feed generator

To overcome those limitations, I decided not to use <code>jekyll-feed</code> and instead write my own tiny RSS generator. My generator is publishing posts and no pages. Here is what you have to do to use it:

For each feed you want to publish, you have to create a markdown file inside of the <code>\_pages</code> folder – for example, a feed with the URL <code>/feed.rss/</code>, that publishes the categories _articles, tools, reading, and journal_ is represented by a file <code>feed.md</code> with the following front matter contents:

<figure>
<figcaption>_pages/feed.md</figcaption>
{% highlight yml %}
---
layout: rssfeed
permalink: /feed.xml/
categories: [articles, tools, reading, journal]
---
{% endhighlight %}
</figure>

The address of the published feed, <code>/feed.xml/</code> in this case, doesn´t need to correspond to the name of the feed definition file, <code>feed.md</code> in our example. You define the feed address with the <code>permalink</code> setting inside of the feed definition file.

You can have multiple feed definition files with different content filters and subsequently different feed addresses.

The filtering of posts is not only working for categories. You can also filter for tags. The following feed definition is valid:

<figure>
<figcaption>_pages/feed.md</figcaption>
{% highlight yml %}
---
layout: rssfeed
permalink: /feed.xml/
tags: [articles, tools, reading, journal]
---
{% endhighlight %}
</figure>

A logical OR filter combination of categories and tags is in the form:

<figure>
<figcaption>_pages/feed.md</figcaption>
{% highlight yml %}
---
layout: rssfeed
permalink: /feed.xml/
categories: [tools]
tags: [reading, journal]
---
{% endhighlight %}
</figure>

Here are all the front matter settings you have:

<table class="underline-rows">
<tr>
<th>Front matter</th>
<th>Value</th>
<th>Meaning</th>
</tr>

<tr>
<td>layout</td>
<td>rssfeed</td>
<td>mandatory</td>
</tr>

<tr>
<td>permalink</td>
<td>/feed.xml/</td>
<td>it can be another URL, but it should end with <code>.xml</code></td>
</tr>

<tr>
<td>categories</td>
<td></td>
<td>an array of all the categories you want to include into the feed</td>
</tr>

<tr>
<td>tags</td>
<td></td>
<td>an array of all the tags you want to include into the feed</td>
</tr>

<tr>
<td>exclude_categories</td>
<td></td>
<td>an array of all the categories you do <em>not</em> want to include into the feed</td>
</tr>

<tr>
<td>exclude_tags</td>
<td></td>
<td>an array of all the tags you do <em>not</em> want to include into the feed</td>
</tr>

<tr>
<td>exclude_layouts</td>
<td></td>
<td>an array of all the layouts you do <em>not</em> want to include into the feed</td>
</tr>
</table>


In the above <code>feed.md</code> file, a layout named <code>rssfeed</code> is referenced. The layout file needs to be available under the name <code>rssfeed.html</code> in the <code>\_layouts</code> folder. The content of <code>rssfeed.html</code> is the tiny programm that creates the feed. It is this:

<figure class="breakout-wide">
<figcaption>_layouts/rssfeed.html</figcaption>
{% highlight markup %}
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>{{- site.title -}}</title>
        <description></description>
        <link>{{- site.url -}}{{- site.baseurl -}}</link>
        <pubDate>{{ site.time | date_to_rfc822 }}</pubDate>
        <lastBuildDate>{{- site.time | date_to_rfc822 -}}</lastBuildDate>
        <generator>Jekyll v{{- jekyll.version -}}</generator>

        {%- assign imageUrl = "src=&quot;" -%}
        {%- assign imageUrl = imageUrl | append: site.url -%}
        {%- assign imageUrl = imageUrl | append: site.baseurl -%}
        {%- assign imageUrl = imageUrl | append: "/" -%}

        {%- assign postUrl = "href=&quot;" -%}
        {%- assign postUrl = postUrl | append: site.url -%}
        {%- assign postUrl = postUrl | append: site.baseurl -%}
        {%- assign postUrl = postUrl | append: "/" -%}

        {%- assign contentNodes = site.posts -%}
        {%- assign pageMeta = "" | split: "" -%}
        {%- assign pageMeta = pageMeta | push: page.tags -%}
        {%- assign pageMeta = pageMeta | push: page.categories -%}
        {%- assign pageMeta = pageMeta|compact|uniq -%}
        {%- if pageMeta.size == 0 -%}
        {%- assign pageMeta = pageMeta | push: "." -%}
        {%- endif -%}

        {%- assign excludeMeta = "" | split: "" -%}
        {%- assign excludeMeta = excludeMeta | push: page.exclude_tags -%}
        {%- assign excludeMeta = excludeMeta | push: page.exclude_categories -%}
        {%- assign excludeMeta = excludeMeta|compact|uniq -%}

        {%- for node in contentNodes -%}
        {%- if node.published != false and node.exclude_feed != true -%}
        {%- unless page.exclude_layouts contains node.layout and node.layout != "rssfeed" -%}

        {%- assign isExcluded = false -%}
        {%- assign nodeMeta = "" | split: "" -%}
        {%- assign nodeMeta = nodeMeta | push: node.tags -%}
        {%- assign nodeMeta = nodeMeta | push: node.categories -%}
        {%- assign nodeMeta = nodeMeta|compact|uniq -%}

        {%- for meta in nodeMeta -%}
        {%- if excludeMeta contains meta -%}
        {%- assign isExcluded = true -%}
        {%- break -%}
        {%- endif -%}
        {%- endfor -%}
        {% unless isExcluded == true %}

        {%- for meta in pageMeta -%}
        {%- if meta == "." or node.tags contains meta or node.categories contains meta -%}
        <item>
            <title>{{ node.title | xml_escape }}</title>
            <author>{{ node.author }}</author>
            <description>
                {%- if node.subtitle -%}&lt;p&gt;{{- node.subtitle -}}&lt;/p&gt;{%- endif -%}
                {%- if node.refer -%}&lt;p&gt;{{- node.refer -}}&lt;/p&gt;{%- endif -%}
                {{- node.content | markdownify | xml_escape | replace: "src=&quot;/",imageUrl | replace: "href=&quot;/",postUrl -}}
            </description>
            <pubDate>{{- node.date | date_to_rfc822 -}}</pubDate>
            <link>{{- node.url | prepend: site.baseurl | prepend: site.url -}}</link>
            <guid>{{- node.url | prepend: site.baseurl | prepend: site.url -}}</guid>
            {%- for tag in node.tags -%}
            <category>{{- tag | xml_escape -}}</category>
            {%- endfor -%}
            {%- for c in node.categories -%}
            <category>{{- c | xml_escape -}}</category>
            {%- endfor -%}
        </item>
        {%- break -%}
        {%- endif -%}
        {%- endfor -%}

        {%- endunless -%}

        {%- endunless -%}
        {%- endif -%}
        {%- endfor -%}
    </channel>

</rss>
{% endhighlight %}
</figure>

Just copy the code above, store it inside of <code>\_layouts/rssfeed.html</code>, and you are ready to use your new RSS feed.
