---
title: Fluid type tools
tags: fonts
---
A well known address for setting up fluid type for a website is [<cite>utopia.fyi</cite>](https://utopia.fyi), which is made by James Gilyead and Trys Mudford. They have tools for type scale, space scale, and grid.

Recently I came across another tool that helps with fluid type, and I like that one a lot: [<cite>www.fluid-type-scale.com</cite>](https://www.fluid-type-scale.com/), by [Aleksandr Hovhannisyan](https://www.aleksandrhovhannisyan.com). Aleksandr supports fluid type scale but other than James and Trys does not have any tooling for space scale or grid on his site. However, the behaviour of his fluid type scale tooling is very elaborate and it´s a pleasure to use and reuse. For example, all the settings applied to the scale become a part of the fuild-type-scale url. I copy and paste the complete url into my CSS so I can always refer to the original scale settings, starting from the point of where I left, tweak something, and return to my CSS, with the modified URL of course. You are free to name your scaling steps like you want to. Also, Aleksandr allows you to decide if you want to rely on CSS `clamp` solely, or if there should be a fallback calculation for browsers that do not support `clamp`. All packaged nicely in a practical UI. 

Both tools, Utopia and the Fluid Type Scale Calculator, are great. I felt a little bit more at home with Aleksandr´s tool.