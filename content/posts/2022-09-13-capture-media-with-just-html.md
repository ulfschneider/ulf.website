---
title: Capture media on mobile devices with just HTML
tags: code
---
## Capture media with HTML

With the HTML attribute [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture), you can do on *mobile* web browsers:^[On *desktop* browsers a file upload dialog will be displayed.]

```html
<div>
    <label for="sound">Capture sound for upload:</label>
    <input type="file" id="sound" capture accept="audio/*">
</div>
<div>
    <label for="environment">Capture a video of your environment for upload:</label>
    <input type="file" id="environment" capture="environment" accept="video/*">
</div>
<div>
    <label for="user">Capture a picture of yourself for upload:</label>
    <input type="file" id="user" capture="user" accept="image/*">
</div>
```

to get:

<figure>
<div class="mry">
    <label for="sound">Capture sound for upload:</label>
    <input type="file" id="sound" capture accept="audio/*">
</div>
<div class="mry">
    <label for="environment">Capture a video of your environment for upload:</label>
    <input type="file" id="environment" capture="environment" accept="video/*">
</div>
<div class="mry">
    <label for="user">Capture a picture of yourself for upload:</label>
    <input type="file" id="user" capture="user" accept="image/*">
</div>
</figure>

`capture="environment"` activates the rear camera while `capture="user"` activates the front camera. An assignment of just `capture` indicates a media capture without further specification of `user` or `environment`.

Notice the use of the [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept) attribute. A value of `accept="audio/*"` will open the audio recorder – in this case it´s sufficient to place `capture` without any additional value inside the `input` tag (==that does not work on iPhone, which still opens the camera for this setting==). A value of `accept="video/*"` will open the camera in video mode, a value of `accept="image/*"` will open the camera in photo mode.  

What´s not used, but would be possible, is to integrate the [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/multiple) attribute to capture *multiple* media with a single dialog.

## Is it worth it?

At first I was excited to have the ability of capturing media with only HTML. At a second look I find it is too limited for real world usage, because:

- The file upload dialog looks so awkward that you anyway need to style it with JavaScript, the advantage of *only HTML* is gone in my view.
- The capturing of media does not work on desktop browsers, which is no-go for me. 
- Capturing audio is not working as expected on iPhone.

