---
title: The decoding attribute for Markdown images
tags: code
---
Starting with version 0.7.0, [<cite>markdown-it-fitmedia</cite>](https://www.npmjs.com/package/markdown-it-fitmedia) will allow to set the `decoding` attribute of images. At first, I set the default value to `decoding="async"`, but to be defensive, from version 0.7.1 on the default value will be `decoding="auto"`, which is the browsers default behavior.

Dave Rupert lists attributes to be carried by `img` tags in his blog entry [<cite>Markdown images are an anti-pattern</cite>](https://daverupert.com/2023/05/markdown-images-anti-pattern/). `markdown-it-fitmedia` will set those attributes for your Markdown images.
