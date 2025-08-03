---
title: markdown-it-mermaid-server
abstract: A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-mermaid-server) to render [Mermaid](https://mermaid.js.org) charts on the server.
tags: tool
---
[<cite>markdown-it-mermaid-server</cite>](https://www.npmjs.com/package/markdown-it-mermaid-server) is a markdown-it plugin that generates Mermaid diagrams on the server and references them as inline SVG images in the Markdown-rendered HTML documents. The approach eliminates the need for Mermaid code on the browser client.

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

