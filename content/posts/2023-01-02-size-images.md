---
title: Responsive images that adapt in width and height
tags: [css, code]
---
CSS allows to size images so that a complete image will fit into the browser window and adapts not only to a change of the window width and height. Even in a small browser window, a viewing or reading user can see the image all at once, without the need of scrolling up and down for a complete impression. I think for images in flowing text such a setting makes sense. See the CSS below:

```css
img {
	max-width: 100%; /* make the image responsive and allow it to take at max 100% of the available width - this will make the image adapt to window width */
	height: auto; /* do not have a fixed setting for height */
	max-height: 80vh; /* the image will take at max 80% of the height of the browser window - this will make the image adapt to window height*/
	object-fit: contain; /* fit the image into the available dimensions while preserving aspect ratio */
	object-position: left; /*align the image to the left inside of the available box*/
}
```

The following HTML

```html
<figure>
<img src="/img/journal/IMG_8256.jpg" style="max-width: 100%; height: auto; max-height: 80vh; object-fit: contain; object-position: left;">
<figcaption><a href="https://www.lichtkunst-unna.de">ZFIL Unna</a>, The future of light art, 2015</figcaption>
</figure>
```

will be rendered like: 

<figure>
<img src="/img/journal/IMG_8256.jpg" style="max-width: 100%; height: auto; max-height: 80vh; object-fit: contain; object-position: left;">
<figcaption><a href="https://www.lichtkunst-unna.de">ZFIL Unna</a>, The future of light art, 2015</figcaption>
</figure>

Resize your browser window and see how the image adapts to changes in width and height. 

The reference box enclosing the downsized image is determined by the original dimensions of the image. For example, if the unmodified image is 900px wide and you set `max-height: 50vh; object-fit: contain; object-position: right;`, the right boundary of the downsized image will be right-aligned to the 900px and will not move further right, even if there would be available space.



