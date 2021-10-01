---
title: URI Generator to create a URL out of a small data object
refer: Tool by David Wilkinson
tags: [journal, code]
---
[data: URI Generator](https://dopiaza.org/tools/datauri/index.php)

Upload a file, provide a URL, or a text, and the tool will create a URI that contains the complete content of your data. 

Useful to create small images or sounds inside of your URI.

When I was using the tool to convert an `.mp3` file from a given URL, I needed to add the mime type manually to the resulting URI. In my case it was **audio/mp3**, like in `data:audio/mp3;base64, …`.

The general format of a data URL is

```
data:[<mime type>][;charset=<charset>][;base64],<encoded data>
```

e.g.:

```
data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAARAAASnwAVFRUVFTQ0NDQ0NFJSUlJSUmVlZWVlZXR0dHR0dIaGhoaGhpOTk5OTk5+fn5+fn6urq6urt7e3t7e3wsLCwsLCzs7Ozs7O2dnZ2dnZ5OTk5OTk8PDw8PDw+fn5+fn5//////8AAAA5TEFNRTMuOThyAqUAAAAALBMAABRGJAVYQgAARgAAEp+UH/y9AAAAAAAAAAAAAAAA …
```