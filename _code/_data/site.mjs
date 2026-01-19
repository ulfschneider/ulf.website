import chalk from "chalk"
import "dotenv/config"

//cache versions
const SCRIPT_VERSION = 6
const HTML_VERSION = 3
const JSON_VERSION = 3
const IMAGE_VERSION = 2
const FONT_VERSION = 1
const CSS_VERSION = 100

const hostname =
  process.env.ELEVENTY_RUN_MODE === "serve"
    ? "localhost:8080"
    : "ulfschneider.io"
const origin =
  process.env.ELEVENTY_RUN_MODE === "serve"
    ? `http://${hostname}`
    : `https://${hostname}`
const buildTime = new Date()

function prepareVersion(version) {
  return process.env.ELEVENTY_RUN_MODE === "serve" ? "" : `-${version}`
}

function useServiceWorker() {
  if (process.env.SERVICE_WORKER == "false") {
    console.log(
      chalk.yellow(
        "Not registering service worker because of environment variable setting SERVICE_WORKER=false"
      )
    )
    return false
  }
  return true
}

function getGitCommitDates() {
  if (process.env.GIT_COMMIT_DATES == "false") {
    console.log(
      chalk.yellow(
        "Not getting git commit dates because of environment variable setting GIT_COMMIT_DATES=false"
      )
    )
    return false
  }
  return true
}

export default {
  locale: "en",
  direction: "ltr",
  title: "Ulf Schneider – Developer and Agile Coach",
  description:
    "Hi, I´m Ulf Schneider, a software developer and agile coach living in Paderborn, Germany.",
  name: hostname,
  hostname: hostname,
  origin: origin,
  buildTime: buildTime,
  useServiceWorker: useServiceWorker(),
  getGitCommitDates: getGitCommitDates(),
  cache: {
    name: "",
    ignore: undefined,
    offlineUrl: "/offline/",
    noCacheUrls: ["/feed.xml"],
    preCacheUrls: ["/offline/", "/navigate/"],
    ignoreCacheRegex: "",
    version: {
      script: prepareVersion(SCRIPT_VERSION),
      html: prepareVersion(HTML_VERSION),
      json: prepareVersion(JSON_VERSION),
      image: prepareVersion(IMAGE_VERSION),
      font: prepareVersion(FONT_VERSION),
      css: prepareVersion(CSS_VERSION)
    }
  },
  ownership: {
    name: "Ulf Schneider",
    email: "mail@ulfschneider.io"
  },
  rss: {
    url: `${origin}/feed.xml`,
    path: "/feed.xml"
  },
  openGraph: {
    imgUrl: `${origin}/og-image.jpg`
  },
  pagefind: {
    path: "/pagefind/pagefind.js"
  },
  tags: {
    star: "star",
    combineThreshold: 30
  },
  posts: {
    doubleNavThreshold: 3
  },
  nav: {
    navigate: {
      key: "n",
      path: "/navigate/"
    },
    home: {
      key: "h",
      path: "/"
    },
    blog: {
      key: "b",
      path: "/blog/"
    },
    search: {
      key: "s",
      path: "/search/"
    },
    about: {
      key: "u",
      path: "/about/"
    },
    colophon: {
      key: "c",
      path: "/colophon/"
    },
    top: {
      key: "t",
      path: "#top"
    },
    older: {
      key: "ArrowRight",
      keyLabel: "→"
    },
    newer: {
      key: "ArrowLeft",
      keyLabel: "←"
    }
  }
}
