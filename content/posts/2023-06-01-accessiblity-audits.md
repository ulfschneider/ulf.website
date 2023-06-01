---
title: Accessibility audits
tags: accessibility
---
Jeremy Keith suggests in his text [<cite>Accessibility audits for all</cite>](https://adactio.com/journal/20212) to verify accessiblity by yourself as far as you can. Jeremy also provides the audit report he produced for the site of his agency, [Clearleft](https://clearleft.com). It contains prioritized findings and recommendations for solving the findings. Here is how Jeremy does audits:

- Put your mouse and trackpad aside and use the <kbd>Tab</kbd> to navigate your website. Do you have a clear focus indication? Is the tabbing order correct?
- Zoom into your site and magnify to 200% or even 500%. Is the site still working and do you get a mobile friendly layout in that case?
- Use tools to examine the sites HTML and CSS. Jeremy suggests [tota11y](https://khan.github.io/tota11y/) and [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html). I´ve used the Firefox Accessiblity Tab of dev tools for the job. Recently I found the [IBM Equal Access Accessibility Checker](https://www.ibm.com/able/toolkit/verify/automated/) an interesting option. It will give more findings than the Firefox checker but that doesn´t mean it´s a better option. With some findings of the IBM checker I am not sure if the indicated items are issues at all, e.g. <q>Violation: The figure element does not have an associated label.</q> The IBM checker has plugins for Chrome and Firefox, and there even is a [Node package](https://www.npmjs.com/package/accessibility-checker).
