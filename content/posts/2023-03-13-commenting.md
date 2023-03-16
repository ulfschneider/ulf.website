---
title: A commenting system with 11ty,  GitHub issues, and Netlify functions
tags: code
draft: true
---
Recently my blog received a commenting upgrade. Any blog post can now become the root of a discussion to happen online. 

When planning for the feature I visited several blogs I´m following with my RSS^[It´s always a satisfying moment to find a new and interesting author having an RSS feed and getting their content with one click by leveraging the most simple and open format for following content on the web. As a bonus, you do not have to give away your e-mail address to receive the content automatically.] reader to see how commenting can be addressed. I could identifiy four *commenting categories:*

1. **Not offering commenting at all:** That´s what I did with my own blog for many years. Many blogs from my RSS reader fall into that category. To name a few, in no specific order: [manuelmoreale.com](https://manuelmoreale.com/), [tonsky.me](https://tonsky.me/blog/), [bradfrost.com](https://bradfrost.com/blog/), [colly.com](https://colly.com/), [world.hey.com/dhh/](https://world.hey.com/dhh/), [deno.com](https://deno.com/blog/), and [ia.net/](https://ia.net/news/). Most simple, straight forward.
2. **Webmentions and being part of the IndieWeb:** Webmentions are not a direct commenting on your own website, but a representation of comments, likes, and posts people have made on different websites, that refer to your website. Examples are: [adactio.com](https://adactio.com/notes/), [nerdy.dev]/https://nerdy.dev/), [hidde.blog](https://hidde.blog/), [matthiasott.com](https://matthiasott.com/),  and [maggieappleton.com](https://maggieappleton.com/). 
3. **Very basic commenting without authentication:** That´s the solution I implemented. Examples are: [chriscoyier.net](https://chriscoyier.net/), [pimpmytype.com](https://pimpmytype.com/), [geoffgraham.me](https://geoffgraham.me/), and [davidwalsh.name](https://davidwalsh.name/).
4. **Commenting through a service, like  commento.io or disqus.com:** I didn´t find examples for that in my RSS list.





