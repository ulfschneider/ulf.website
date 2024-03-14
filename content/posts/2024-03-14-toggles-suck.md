---
title: Toggles suck
tags: accessibility
draft: true
---
Checkboxes and radio buttons convey a clear state in a simple way: A checked checkbox is "on", same is a filled radio button, empty radio buttons and empty checkboxes are "off". 

<figure>
<label class="flex flex-row items-center gap-ryt"><input type="checkbox" checked/>A checkbox can be on or off</label>
<figcaption>A checkbox communicates on/off state without additional explanation</figcaption>
</figure>

<figure>
<label class="my-ryt flex flex-row items-center gap-ryt"><input type="radio" name="radio-group">Is it me?</label>
<label class="my-ryt flex flex-row items-center gap-ryt"><input type="radio" name="radio-group">Or me?</label>
<label class="my-ryt flex flex-row items-center gap-ryt"><input type="radio" name="radio-group" checked>Or even me?</label>
<figcaption>Radio buttons communicate the chosen option without additional explanation</figcaption>
</figure>

You cannot say the same about toggles. A toggle needs additional explanation for the "on" and "off" state, whether it´s through color-coding (green for "on", red or grey for "off"), or through text. A toggle is not natively supported by web browsers, which means developers need to build them (except for Safari 17.4, which is starting to have a native toggle). Green and red colors can be a problem for green-red disabled people (8% of males and 0.5% of females are affected, according to the Wikipedia article about [<cite> Color blindness</cite>](https://en.wikipedia.org/wiki/Color_blindness)). See the example below, which is a screenshot from the web-version of Microsoft Outlook. You cannot tell easily which of the two toggles is on or off.

<figure>
<img src="/img/accessibility/toggle-microsoft-outlook.png">
<figcaption>The screenshot is taken from web-version of Microsoft Outlook. Can you tell which of the two toggles is on and which one is off?</figcaption>
</figure>

> ==Toggles fail to convey their current status without making users think!== They also have very poor accessibility for users with disabilities. They are used inconsistently across the web, and they don’t have native HTML support. Use checkboxes or radio groups instead.
> <footer><a href="https://axesslab.com/toggles-suck/"><cite>Toggles suck!</cite></a>, by Joel Holmberg</footer>

Joel Holmberg has good arguments for his position and I agree. If you want to know better, read his excellent article [<cite>Toggles suck!</cite>](https://axesslab.com/toggles-suck/). 

Along the way you will learn that placeholder text inside form fields is to be avoided because users sometimes assume the field is populated with content and will not require any more work. The same is true for labels that are positioned inside of fields and move away once the users puts the focus inside of the field (like with [Material UI components](https://mui.com/material-ui/react-text-field/#basic-textfield)).

