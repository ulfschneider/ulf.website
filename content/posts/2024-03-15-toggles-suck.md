---
title: Toggles suck
tags: accessibility
---
Checkboxes and radio buttons convey a clear state in a simple way: A check means "on", a missing check means "off". 

<figure>
<label class="max-w-fit flex flex-row gap-ryt items-center"> <input type="checkbox" id="checkbox" checked/> <span>A checkbox can be on or off</span></label>
<figcaption>A checkbox communicates the on/off state and does not require additional explanation</figcaption>
</figure>

<figure>
<label class="max-w-fit flex flex-row gap-ryt items-center"><input type="radio" name="radio-group" id="uranus"> <span>Uranus</span></label>
<label class="max-w-fit flex flex-row gap-ryt items-center"><input type="radio" name="radio-group" id="neptun"> <span>Neptun</span></label>
<label class="max-w-fit flex flex-row gap-ryt items-center"><input type="radio" name="radio-group" id="earth" checked> <span>Earth</span></label>
<figcaption>Radio buttons communicate all available options, and the chosen option, without additional explanation required</figcaption>
</figure>

A toggle, in contrast, needs additional explanation for the "on" and "off" state, whether it´s through color-coding (green for "on", red or grey for "off"), or through text. A toggle is not natively supported by web browsers^[The only web browser supporting toggles natively at the time of writing is Safari. Please refer to [<cite> Safari has a native toggle control</cite>](/2024-03-15-safari-toggle/).], which means developers need to build them, which makes the use of toggles inconsistent across the web. Red and green colors will be a problem for red/green disabled people (8% of males and 0.5% of females are affected, according to [<cite>About Colour Blindness</cite>](https://www.colourblindawareness.org/colour-blindness/ )). It is also not clear to me, if, as a convention, a toggle thumb at the right means "on" and at the left means "off".

See the example below, which is a screenshot from the web-version of Microsoft Outlook. You cannot tell easily which of the two toggles is on or off.

<figure>
<img src="/img/accessibility/toggle-microsoft-outlook.png">
<figcaption>The screenshot is taken from the web-version of Microsoft Outlook. Can you tell which of the two toggles is on and which one is off?</figcaption>
</figure>

> ==Toggles fail to convey their current status without making users think!== They also have very poor accessibility for users with disabilities. They are used inconsistently across the web, and they don’t have native HTML support. Use checkboxes or radio groups instead.
> <footer><a href="https://axesslab.com/toggles-suck/"><cite>Toggles suck!</cite></a>, by Joel Holmberg</footer>

Joel Holmberg has good arguments for his position and I agree. If you want to know better, read his excellent article [<cite>Toggles suck!</cite>](https://axesslab.com/toggles-suck/).^[Along the way you will learn that placeholder text inside form fields is to be avoided because users sometimes assume the field is populated with content and will not require any more work. The same is true for labels that are positioned inside of fields and move away once the users puts the focus inside of the field (like with [Material UI components](https://mui.com/material-ui/react-text-field/#basic-textfield))] Further reading:  [<cite>Toggle Switch Guidelines</cite>](https://www.nngroup.com/articles/toggle-switch-guidelines/), by Alita Joyce on nngroup.com, and  [<cite>Safari Gets a Toggle Switch Input</cite>](https://frontendmasters.com/blog/safari-gets-a-toggle-switch-input/), by Dave Rupert on frontendmasters.com.

