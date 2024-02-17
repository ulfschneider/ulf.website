---
title: Design between breakpoints
tags:
  - design
  - code
---
Here is a top advice for designing responsive websites:

> Pick breakpoints by starting with the smallest screen and expand the browser-width until the page doesn´t look good anymore. Here you have to introduce a breakpoint. 
> <footer><a href="https://cloudfour.com/thinks/design-happens-between-breakpoints/"><cite>Design Happens Between Breakpoints</cite></a>, Jason Grigsby, May 20th, 2022. I think the concept was presented first by <a href="https://www.the-haystack.com" >Stephen Hay</a> with his Responsive Design Workflow.</footer>

Worry less about how to align breakpoints with actual device dimensions. Those device oriented breakpoints are suggestions. Physical device dimensions are not to ignore, but they should not dictate the breakpoints. Look at [<cite>Saving Your Web Workflows with Prototyping</cite>](https://matthiasott.com/articles/saving-your-web-workflows-with-prototyping) and you will be surprised how many different physical dimensions current devices have. It´s an illusion to think you could do it right by focusing on certain fixed device sizes for your breakpoints.

When designing responsive websites by starting with a small screen and introducing a breakpoint when the page layout requires it, you will resize your browser window all the time to see how the page layout works at different sizes. 

This design process is impossible to follow by creating static mockups of  page layouts in a design tool and then implementing those mockups for the browser. 

> The most common use of mockups in software development is to create user interfaces that show the end user what the software will look like without having to build the software or the underlying functionality. Software UI mockups can range from very simple hand drawn screen layouts, through realistic bitmaps, to semi functional user interfaces developed in a software development tool. 
> <footer><a href="https://en.wikipedia.org/wiki/Mockup"><cite>Mockup</cite></a>, Wikipedia</footer>

Static mockups play a role, for example when gathering ideas. I like lightweight hand sketch mockups (if you would call that a mockup). They are powerful for communicating ideas and are quick to make. 

When the entire process is relying on the two subsequent steps of designing a polished static mockup with a design tool and then implementing it, you have introduced a nice waterfall process in your workflow and waterfall processes make learning slow and expensive, while you want quick learning in any software project! I´ve written in [<cite>Move on from Figma</cite>](2023-06-28-move-on-from-figma/) and in [<cite>Serious play</cite>](/2024-01-21-serious-play/) about how tools like Figma can have a negative impact on a teams development process.

I prefer coding and adjusting continuously within a browser, *the medium of delivery.* You can do it either within a development branch of your product or by applying prototying techniques. Either way means designing with code.

Not every prototype you build and not every idea you develop finds its way into your final product. It happens you have to throw away your prototyping work because you learned it does not address your users problems in the best way. Some of your experiments will survive, and make it further into your product. 

There are two ways to design with code:

It can be done by a single person able work with both forms of expression, design and code. Jim Nielsen calls this person a design engineer and Jim has an excellent example of the problems being solved by design with code in his text [<cite>The Case For Design Engineers, Pt. II</cite>](https://blog.jim-nielsen.com/2024/the-case-for-design-engineers-pt-ii/). 

The alternative is two closely collaborating people, a designer and a coder, continuously working together to identify the relevant details, taking decisions and implementing so that it doesn´t feel like designed first and implemented second. 





