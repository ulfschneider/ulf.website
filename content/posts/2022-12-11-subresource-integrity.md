---
title: Subresource Integrity (SRI) to protect from malicious JavaScript
tags: code
draft: true
---
[<cite>Using SRI to protect from malicious JavaScript</cite>](https://www.htmhell.dev/adventcalendar/2022/3/) by [Saptak Sengupta](https://saptaks.website/) hinted me to what *Subresource Integrity (SRI)* is, and how it can be applied to the resource files (CSS, JavaScfript) that are part of a website. 

SRI ensures that files fetched by a website from a Content Delivery Network (CDN) or anywhere else, like your own servers, are delivered without a third party injecting any additional and malicious content into those files.

Spec: https://www.w3.org/TR/SRI/#cross-origin-data-leakage

> Subresoure Integrity enables browsers to verify that the resources they fetch are delivered without unexpected manipulation. It works by allowing you to provide a cryptographic hash that a fetched resource must match.
> <footer><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity">Mozilla Developer Network</a></footer>

Basically, SRI means adding the `integrity` attribute and the `crossorigin` attribute to the JavaScript loading tag, which will look like:

```html
<script
  src="https://code.jquery.com/jquery-3.6.1.js"
  integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI=" 
  crossorigin="anonymous">
</script>
```

The `integrity` attribute contains the file hash. 

```
integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
```

The attribute has 2 parts - the hashing algorithm and the hash of the file. There are 3 different hash functions that are supported for SRI - `sha256`, `sha384` and `sha512`. An eysy way of doing this is via [www.srihash.org](https://www.srihash.org/). Paste the link to the resource and generate a hash. 

An alternative way is to create the hash locally on your machine by leveraging openssl. This would make sense as part of a build process, where the hash will be created and used automatically.

```shell
openssl dgst -sha384 -binary react.production.min.js | openssl base64 -A
```



Since when using a CDN the resource is not present in the same origin, the `crossorigin` attribute must be set to make the response eligible for integrity validation. Without the `crossorigin` attribute, the browser will load the script as if the integrity attribute was not present. We set the value of crossorigin attribute to "anonymous" to ensure that no user credentials or cookie informations are sent to the CDN server.


