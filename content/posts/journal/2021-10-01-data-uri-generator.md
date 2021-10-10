---
title: Data URL Generator to create a URL out of a small data object
tags: [journal, code]
---
<figure>
<a href="https://dopiaza.org/tools/datauri/index.php">Data URL Generator</a>
<figcaption>Tool by David Wilkinson. Upload a file, provide a URL, or a text, and the tool will create a URI that contains the complete content of your data.</figcaption>
</figure>

<blockquote>Data URLs, URLs prefixed with the data: scheme, allow content creators to embed small files inline in documents. They were formerly known as "data URIs" until that name was retired by the WHATWG.
<footer><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs">MDN Web Docs</a></footer>
</blockquote>

When I was using the tool to convert an `.mp3` file from a given URL, I needed to add the mime type manually to the resulting URI. In my case it was **audio/mp3**, like in `data:audio/mp3;base64, …`.

The general format of a data URL is

```
data:[<mime type>][;charset=<charset>][;base64],<encoded data>
```

e.g.:

```
data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAARAAASnwAVFRUVFTQ0NDQ0NFJSUlJSUmVlZWVlZXR0dHR0dIaGhoaGhpOTk5OTk5+fn5+fn6urq6urt7e3t7e3wsLCwsLCzs7Ozs7O2dnZ2dnZ5OTk5OTk8PDw8PDw+fn5+fn5//////8AAAA5TEFNRTMuOThyAqUAAAAALBMAABRGJAVYQgAARgAAEp+UH/y9AAAAAAAAAAAAAAAA …
```