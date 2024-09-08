---
title: Indicate the full language name when syntax highlighting with 11ty and Prism
tags:
  - code
  - css
---
[[toc]]

## The goal
When using [11ty](https://11ty.dev) to build your blog, you likely are using the plugin `@11ty/eleventy-plugin-syntaxhighlight` for syntax highlighting. The plugin is running [Prism](https://prismjs.com) under the hood. To indicate your readers the names of the highlighted languages with the correct spelling, you can map the language key processed by Prism to a correctly spelled language name, and assign it to a HTML attribute, which you can name however you want. That again will allow you to display and style the name of the language with CSS. The resulting HTML will look similar to the example below. You see, I named the attribute `data-language` and it has the value `JavaScript` assigned:

```html
<pre class="language-js" data-language="JavaScript">
<code class="language-js">
<!-- here comes the syntax-highlighted code -->
</code>
</pre>
```

## How it´s achieved

To achieve that result, add the [syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) to your npm dependencies, with

```sh
npm install @11ty/eleventy-plugin-syntaxhighlight
```

and modify your `eleventy.js` configuration file in the following way:

```js
//eleventy.js
eleventyConfig.addPlugin(syntaxHighlight, {
  //define the attributes for the pre tag
  preAttributes: {
    "data-language": function ({ language, content, options }) {
      return resolvePrismLanguage(language)
    },
  },
  //define the attribute for the code tag,
  //we do not need that currently
  codeAttributes: {},
});
```

The `preAttributes` property of the highlighting plugin is used to ensure the surrounding `pre` tag of syntax-highlighted code blocks is getting the attribute `data-language` assigned. The exact value for the attribute is resolved by the function `resolvePrismLanguage()`.  The code of the function is listed below (the key-values of `PRISM_LANGUAGES` are copied from [Prism: Show Language](https://prismjs.com/plugins/show-language/)):

```js
//this code could be inside your eleventy.js, 
//or move it into something like utils.js
//
//the contents of PRISM_LANGUAGES is copied from
//https://prismjs.com/plugins/show-language/
const PRISM_LANGUAGES = {
  none: "Plain text",
  plain: "Plain text",
  plaintext: "Plain text",
  text: "Plain text",
  txt: "Plain text",
  html: "HTML",
  xml: "XML",
  svg: "SVG",
  mathml: "MathML",
  ssml: "SSML",
  rss: "RSS",
  css: "CSS",
  clike: "C-like",
  js: "JavaScript",
  abap: "ABAP",
  abnf: "ABNF",
  al: "AL",
  antlr4: "ANTLR4",
  g4: "ANTLR4",
  apacheconf: "Apache Configuration",
  apl: "APL",
  aql: "AQL",
  ino: "Arduino",
  arff: "ARFF",
  armasm: "ARM Assembly",
  "arm-asm": "ARM Assembly",
  art: "Arturo",
  asciidoc: "AsciiDoc",
  adoc: "AsciiDoc",
  aspnet: "ASP.NET (C#)",
  asm6502: "6502 Assembly",
  asmatmel: "Atmel AVR Assembly",
  autohotkey: "AutoHotkey",
  autoit: "AutoIt",
  avisynth: "AviSynth",
  avs: "AviSynth",
  "avro-idl": "Avro IDL",
  avdl: "Avro IDL",
  awk: "AWK",
  gawk: "GAWK",
  sh: "Shell",
  basic: "BASIC",
  bbcode: "BBcode",
  bbj: "BBj",
  bnf: "BNF",
  rbnf: "RBNF",
  bqn: "BQN",
  bsl: "BSL (1C:Enterprise)",
  oscript: "OneScript",
  csharp: "C#",
  cs: "C#",
  dotnet: "C#",
  cpp: "C++",
  cfscript: "CFScript",
  cfc: "CFScript",
  cil: "CIL",
  cilkc: "Cilk/C",
  "cilk-c": "Cilk/C",
  cilkcpp: "Cilk/C++",
  "cilk-cpp": "Cilk/C++",
  cilk: "Cilk/C++",
  cmake: "CMake",
  cobol: "COBOL",
  coffee: "CoffeeScript",
  conc: "Concurnas",
  csp: "Content-Security-Policy",
  "css-extras": "CSS Extras",
  csv: "CSV",
  cue: "CUE",
  dataweave: "DataWeave",
  dax: "DAX",
  django: "Django/Jinja2",
  jinja2: "Django/Jinja2",
  "dns-zone-file": "DNS zone file",
  "dns-zone": "DNS zone file",
  dockerfile: "Docker",
  dot: "DOT (Graphviz)",
  gv: "DOT (Graphviz)",
  ebnf: "EBNF",
  editorconfig: "EditorConfig",
  ejs: "EJS",
  etlua: "Embedded Lua templating",
  erb: "ERB",
  "excel-formula": "Excel Formula",
  xlsx: "Excel Formula",
  xls: "Excel Formula",
  fsharp: "F#",
  "firestore-security-rules": "Firestore security rules",
  ftl: "FreeMarker Template Language",
  gml: "GameMaker Language",
  gamemakerlanguage: "GameMaker Language",
  gap: "GAP (CAS)",
  gcode: "G-code",
  gdscript: "GDScript",
  gedcom: "GEDCOM",
  gettext: "gettext",
  po: "gettext",
  glsl: "GLSL",
  gn: "GN",
  gni: "GN",
  "linker-script": "GNU Linker Script",
  ld: "GNU Linker Script",
  "go-module": "Go module",
  "go-mod": "Go module",
  graphql: "GraphQL",
  hbs: "Handlebars",
  hs: "Haskell",
  hcl: "HCL",
  hlsl: "HLSL",
  http: "HTTP",
  hpkp: "HTTP Public-Key-Pins",
  hsts: "HTTP Strict-Transport-Security",
  ichigojam: "IchigoJam",
  "icu-message-format": "ICU Message Format",
  idr: "Idris",
  ignore: ".ignore",
  gitignore: ".gitignore",
  hgignore: ".hgignore",
  npmignore: ".npmignore",
  inform7: "Inform 7",
  javadoc: "JavaDoc",
  javadoclike: "JavaDoc-like",
  javastacktrace: "Java stack trace",
  jq: "JQ",
  jsdoc: "JSDoc",
  "js-extras": "JS Extras",
  json: "JSON",
  webmanifest: "Web App Manifest",
  json5: "JSON5",
  jsonp: "JSONP",
  jsstacktrace: "JS stack trace",
  "js-templates": "JS Templates",
  keepalived: "Keepalived Configure",
  kts: "Kotlin Script",
  kt: "Kotlin",
  kumir: "KuMir (КуМир)",
  kum: "KuMir (КуМир)",
  latex: "LaTeX",
  tex: "TeX",
  context: "ConTeXt",
  lilypond: "LilyPond",
  ly: "LilyPond",
  emacs: "Lisp",
  elisp: "Lisp",
  "emacs-lisp": "Lisp",
  llvm: "LLVM IR",
  log: "Log file",
  lolcode: "LOLCODE",
  magma: "Magma (CAS)",
  md: "Markdown",
  markdown: "Markdown",
  "markup-templating": "Markup templating",
  matlab: "MATLAB",
  maxscript: "MAXScript",
  mel: "MEL",
  metafont: "METAFONT",
  mongodb: "MongoDB",
  moon: "MoonScript",
  n1ql: "N1QL",
  n4js: "N4JS",
  n4jsd: "N4JS",
  "nand2tetris-hdl": "Nand To Tetris HDL",
  naniscript: "Naninovel Script",
  nani: "Naninovel Script",
  nasm: "NASM",
  neon: "NEON",
  nginx: "nginx",
  nsis: "NSIS",
  objectivec: "Objective-C",
  objc: "Objective-C",
  ocaml: "OCaml",
  opencl: "OpenCL",
  openqasm: "OpenQasm",
  qasm: "OpenQasm",
  parigp: "PARI/GP",
  objectpascal: "Object Pascal",
  psl: "PATROL Scripting Language",
  pcaxis: "PC-Axis",
  px: "PC-Axis",
  peoplecode: "PeopleCode",
  pcode: "PeopleCode",
  php: "PHP",
  phpdoc: "PHPDoc",
  "php-extras": "PHP Extras",
  "plant-uml": "PlantUML",
  plantuml: "PlantUML",
  plsql: "PL/SQL",
  powerquery: "PowerQuery",
  pq: "PowerQuery",
  mscript: "PowerQuery",
  powershell: "PowerShell",
  promql: "PromQL",
  properties: ".properties",
  protobuf: "Protocol Buffers",
  purebasic: "PureBasic",
  pbfasm: "PureBasic",
  purs: "PureScript",
  py: "Python",
  qsharp: "Q#",
  qs: "Q#",
  q: "Q (kdb+ database)",
  qml: "QML",
  rkt: "Racket",
  cshtml: "Razor C#",
  razor: "Razor C#",
  jsx: "React JSX",
  tsx: "React TSX",
  renpy: "Ren'py",
  rpy: "Ren'py",
  res: "ReScript",
  rest: "reST (reStructuredText)",
  robotframework: "Robot Framework",
  robot: "Robot Framework",
  rb: "Ruby",
  sas: "SAS",
  sass: "Sass (Sass)",
  scss: "Sass (SCSS)",
  "shell-session": "Shell session",
  "sh-session": "Shell session",
  shellsession: "Shell session",
  shell: "Shell",
  sh: "Shell",
  sml: "SML",
  smlnj: "SML/NJ",
  solidity: "Solidity (Ethereum)",
  sol: "Solidity (Ethereum)",
  "solution-file": "Solution file",
  sln: "Solution file",
  soy: "Soy (Closure Template)",
  sparql: "SPARQL",
  rq: "SPARQL",
  "splunk-spl": "Splunk SPL",
  sqf: "SQF: Status Quo Function (Arma 3)",
  sql: "SQL",
  stata: "Stata Ado",
  iecst: "Structured Text (IEC 61131-3)",
  supercollider: "SuperCollider",
  sclang: "SuperCollider",
  systemd: "Systemd configuration file",
  "t4-templating": "T4 templating",
  "t4-cs": "T4 Text Templates (C#)",
  t4: "T4 Text Templates (C#)",
  "t4-vb": "T4 Text Templates (VB)",
  tap: "TAP",
  tt2: "Template Toolkit 2",
  toml: "TOML",
  trickle: "trickle",
  troy: "troy",
  trig: "TriG",
  ts: "TypeScript",
  tsconfig: "TSConfig",
  uscript: "UnrealScript",
  uc: "UnrealScript",
  uorazor: "UO Razor Script",
  uri: "URI",
  url: "URL",
  vbnet: "VB.Net",
  vhdl: "VHDL",
  vim: "vim",
  "visual-basic": "Visual Basic",
  vba: "VBA",
  vb: "Visual Basic",
  wasm: "WebAssembly",
  "web-idl": "Web IDL",
  webidl: "Web IDL",
  wgsl: "WGSL",
  wiki: "Wiki markup",
  wolfram: "Wolfram language",
  nb: "Mathematica Notebook",
  wl: "Wolfram language",
  xeoracube: "XeoraCube",
  "xml-doc": "XML doc (.net)",
  xojo: "Xojo (REALbasic)",
  xquery: "XQuery",
  yaml: "YAML",
  yml: "YAML",
  yang: "YANG",
};

//map the given prism language key, like "js", to 
//a correctly spelled language name, like "JavaScript"
resolvePrismLanguage(language) {
  return PRISM_LANGUAGES[language] || language || "";
}
```

Finally, you will use CSS to select the `data-language` attribute and present its contents to your readers, e.g.:

```css
pre[data-language]:not([data-language=""]) {
  &::before {
    content: attr(data-language) ":";
    display: block;
  }
}
```
