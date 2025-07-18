---
title: markdown-it-mermaid-server
abstract: A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-mermaid-server) to render [Mermaid](https://mermaid.js.org) charts on the server.
tags: tool
---
[<cite>markdown-it-mermaid-server</cite>](https://www.npmjs.com/package/markdown-it-mermaid-server) is a markdown-it plugin that generates Mermaid diagrams on the server and references them as SVG images in the Markdown-rendered HTML documents. The approach eliminates the need for Mermaid code the browser client.

Enclose the Mermaid chart definition in a fenced code block, introduced by the `mermaid` keyword, like this:

~~~markdown
```mermaid
flowchart LR
A(["Start"]) --> B{"Decision"}
B --> C["Option A"] & D["Option B"]
```
~~~

and get the resulting chart:

```mermaid
flowchart LR
A(["Start"]) --> B{"Decision"}
B --> C["Option A"] & D["Option B"]
```

The plugin relies on [@mermaid-js/mermaid-cli](https://www.npmjs.com/package/@mermaid-js/mermaid-cli/) as a npm peer dependency, which allows you to update the Mermaid library independent of the plugin.

The chart creation process can be configured by the optional providing of a `mermaidConfig` object, a `puppeteerConfig` object, and a `themeCSS` string.
