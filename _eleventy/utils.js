const markdownIt = require("markdown-it");
const slugify = require("slugify");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTocDoneRight = require("markdown-it-toc-done-right");
const markdownItDefList = require("markdown-it-deflist");
const markdownItContainer = require("markdown-it-container");
const markdownItFitMedia = require("markdown-it-fitmedia");
const markdownItTrimmer = require("markdown-it-trimmer");
const markdownItCooklang = require("markdown-it-cooklang");
const markdownItScrollTable = require("markdown-it-scrolltable");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItMark = require("markdown-it-mark");
const markdownItMathJax = require("markdown-it-mathjax3");
const markdownItEmoji = require("markdown-it-emoji");
const markdownItInclude = require("markdown-it-include");
const markdownItGitHubAlerts = require("markdown-it-rss-friendly-github-alerts");
const striptags = require("striptags");
const fs = require("fs");
const path = require("path");

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

function mySlugify(s) {
  return slugify(s, { lower: true });
}

const site = require("../_data/site.js");

module.exports = {
  firstImageTag: function (html) {
    if (html) {
      const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
      if (match) {
        return match[0];
      }
    }
  },

  allImageTags: function (html) {
    if (html) {
      const matches = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/gi);
      if (matches) {
        return matches;
      } else {
        return [];
      }
    }
  },

  getAttr: function (html, attr) {
    if (html) {
      const match = html.match(new RegExp(`${attr}="(.*?)"`, "i"));
      if (match) {
        return match[1];
      }
    }
  },

  srcAttr: function (html) {
    return this.getAttr(html, "src");
  },

  altAttr: function (html) {
    return this.getAttr(html, "alt");
  },

  isLiveItem: function (item) {
    const now = new Date();
    return (
      item.date <= now && item.data.draft !== true && item.data.draft !== "yes"
    );
  },

  isPost: function (item) {
    return item.inputPath.startsWith(`./${site.input}/posts/`);
  },

  tagUrl: function (tag) {
    let standard = {
      tag: "*",
      url: "*",
    };
    let empty = {
      tag: "",
      url: "",
    };
    let siteTags = site.tagnav;
    if (siteTags) {
      for (let v of siteTags) {
        if (typeof v != "string" && !(v instanceof String)) {
          if (v.tag == tag) {
            return v.url;
          }
          if (v.tag == "*") {
            standard = v;
          }
          if (!v.tag) {
            empty = v;
          }
        }
      }
    }

    if (tag == "") {
      return empty.url;
    } else {
      return standard.url.replace(/\*/g, tag);
    }
  },

  removeHtml: function (text) {
    if (text) {
      return striptags(text);
    }
  },

  compareItemDate: function (a, b) {
    return a.date - b.date;
  },

  compareInputFileName: function (a, b) {
    const aFileName = path.basename(a.inputPath);
    const bFileName = path.basename(b.inputPath);
    return aFileName.localeCompare(bFileName);
  },

  resolvePrismLanguage(language) {
    if (language.startsWith("diff-")) {
      language = language.substring(5);
    } else if (language == "diff") {
      language = "";
    }
    return PRISM_LANGUAGES[language] || language || "";
  },

  isoDate: function (d) {
    if (d) {
      return d.toISOString();
    } else {
      return "";
    }
  },

  humanDate: function (d) {
    if (d) {
      return new Intl.DateTimeFormat(site.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } else {
      return "";
    }
  },

  humanDateTime: function (d) {
    if (d) {
      return new Intl.DateTimeFormat(site.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        second: "numeric",
      }).format(d);
    } else {
      return "";
    }
  },

  extractTags: function (collection) {
    let tagSet = new Set();
    for (let post of collection) {
      if (post.data.tags) {
        for (let tag of post.data.tags) {
          tagSet.add(tag);
        }
      }

      if (post.data?.tags?.includes(site.starTag)) {
        post.data.starred = site.starTag;
      } else {
        post.data.starred = "";
      }
    }
    return [...tagSet].sort();
  },

  chunk: function (values = [], chunkSize = 1) {
    let chunks = [];
    let tmp = [...values];
    if (chunkSize <= 0) return chunks;
    while (tmp.length) {
      chunks.push(tmp.splice(0, chunkSize));
    }
    return chunks;
  },

  chunkByYear: function (values = [], dateProperty = "date") {
    let years = new Map();
    for (let entry of values) {
      let date = new Date(entry[dateProperty]);
      let year = date.getFullYear();
      let chunk = years.get(year);
      if (!chunk) {
        chunk = [];
        chunk.year = year;
        years.set(year, chunk);
      }
      chunk.push(entry);
    }

    if (values.length / years.size <= 5) {
      //if each year in average contains <= 5 entries
      //do not chunk into years and return a single chunk!
      let chunk = [...values];
      chunk.years = [...years.keys()].sort();
      if (chunk.years.at(0) != chunk.years.at(-1)) {
        chunk.yearsInterval = [chunk.years.at(0), chunk.years.at(-1)];
      } else {
        chunk.year = chunk.years.at(0);
        delete chunk.years;
      }
      return [chunk];
    } else {
      return [...years.values()];
    }
  },

  newestPage: function (path) {
    return path;
  },

  oldestPage: function (path, max) {
    return path + max + "/";
  },

  newerPage: function (path, currentIndex) {
    if (currentIndex > 1) {
      return path + currentIndex + "/";
    } else if (currentIndex == 1) {
      return path;
    } else {
      return "";
    }
  },

  currentPage: function (path, currentIndex) {
    if (currentIndex >= 1) {
      return path + (currentIndex + 1) + "/";
    } else return path;
  },

  olderPage: function (path, currentIndex, max) {
    if (currentIndex < max - 1) {
      return path + (currentIndex + 2) + "/";
    } else {
      return "";
    }
  },

  getMarkdownLib: function () {
    const mdlib = markdownIt({
      html: true,
      breaks: true,
      linkify: false,
      typographer: true,
      quotes: "„“‚‘",
    })
      .use(markdownItContainer)
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink({
          safariReaderFix: true,
          class: "heading-anchor",
        }),
        slugify: mySlugify,
      })
      .use(markdownItTocDoneRight, {
        slugify: mySlugify,
      })
      .use(markdownItMark)
      .use(markdownItDefList)
      .use(markdownItScrollTable)
      .use(markdownItAttrs)
      .use(markdownItFootnote)
      .use(markdownItTrimmer)
      .use(markdownItFitMedia, {
        imgDir: `./${site.input}`,
        decoding: "async",
      })
      .use(markdownItMathJax)
      .use(markdownItEmoji)
      .use(markdownItInclude)
      .use(markdownItGitHubAlerts)
      .use(markdownItCooklang, {
        cookware: {
          startWith: "+", //do not interfere with the #, which is used for tags in iA Writer
        },
      });

    return mdlib;
  },

  hashCode: function (value, seed = 0) {
    //from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    str = String(value);
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },

  stat: function (path) {
    return fs.statSync(path);
  },

  getTrimBase: function () {
    let base = site.base;
    if (base) {
      return base.replace(/\//g, "");
    } else {
      return "";
    }
  },

  getBase: () => {
    let base = site.base;
    if (base && base != "/") {
      return `/${base.replace(/\//g, "")}/`;
    } else {
      return "/";
    }
  },
};
