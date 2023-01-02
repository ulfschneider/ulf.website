---
title: Fit images entirely into the browser window
tags: [css, code]
---
CSS allows to size images so that a complete image will fit into the browser window. I like to style images in flowing text this way because even for a small browser window a viewing or reading user can see the image at once, without the need of scrolling up and down for a complete impression. 

```css
img {
	max-width: 100%; /* make the image responsive and allow it to take at max 100% of the available width */
	height: auto; /* do not have a fixed setting for height */
	max-height: 80vh; /* the image will be limited to take at max 80% of the height of the browser window */
	object-fit: contain; /* fit the image into the available dimensions while preserving aspect ratio */
}
```

Example:

<figure>
<img src="/img/bauhaus/IMG_8431.jpg" style="max-width: 100%; height: auto; max-height: 80vh; object-fit: contain;">
<figcaption>The Bauhaus in Dessau</figcaption>
</figure>

In addition to `object-fit` the `object-position` property allows to move the image to the center or the left of the available space. The available space – the elements box – in this case is defined by the original image size. If the unmodified image is 900px wide, the available space will not be wider than 900px. The default value is `object-position: 50% 50%`, which centers the image into the elements box horizontally (first value) and vertically (second value). It´s also possible to assign text values, like `object-position: right bottom;`.

<figure>
<img src="/img/bauhaus/IMG_8431.jpg" style="max-width: 100%; height: auto; max-height: 25vh; object-fit: contain; object-position: left;">
<figcaption>The Bauhaus in Dessau, <code>max-height:25vh; object-fit: contain; object-position:left;</code></figcaption>
</figure>

<figure>
<img src="/img/bauhaus/IMG_8431.jpg" style="max-width: 100%; height: auto; max-height: 25vh; object-fit: contain; object-position: center;">
<figcaption>The Bauhaus in Dessau, <code>max-height:25vh; object-fit: contain; object-position:center;</code></figcaption>
</figure>

<figure>
<img src="/img/bauhaus/IMG_8431.jpg" style="max-width: 100%; height: auto; max-height: 25vh; object-fit: contain; object-position: right;">
<figcaption>The Bauhaus in Dessau, <code>max-height:25vh; object-fit: contain; object-position:right;</code></figcaption>
</figure>



