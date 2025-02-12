import "dotenv/config";
import chalk from "chalk";

const hostname =
  process.env.ELEVENTY_RUN_MODE === "serve"
    ? "localhost:8080"
    : "ulfschneider.io";
const origin =
  process.env.ELEVENTY_RUN_MODE === "serve"
    ? `http://${hostname}`
    : `https://${hostname}`;
const buildTime = new Date();

function getVersion(version) {
  return process.env.ELEVENTY_RUN_MODE === "serve" ? "" : `-${version}`;
}

function useServiceWorker() {
  if (process.env.SERVICE_WORKER == "false") {
    console.log(
      chalk.yellow(
        "Not registering service worker because of environment variable setting SERVICE_WORKER=false",
      ),
    );
    return false;
  }
  return true;
}

function getGitCommitDates() {
  if (process.env.GIT_COMMIT_DATES == "false") {
    console.log(
      chalk.yellow(
        "Not getting git commit dates because of environment variable setting GIT_COMMIT_DATES=false",
      ),
    );
    return false;
  }
  return true;
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
    preCacheUrls: ["/", "/offline/"],
    ignoreCacheRegex: "",
    version: {
      script: getVersion(2),
      html: getVersion(2),
      json: getVersion(2),
      image: getVersion(1),
      font: getVersion(1),
      css: getVersion(3),
    },
  },
  ownership: {
    name: "Ulf Schneider",
    email: "mail@ulfschneider.io",
  },
  rss: {
    url: `${origin}/feed.xml`,
    path: "/feed.xml",
  },
  search: {
    path: "/search/",
  },
  openGraph: {
    imgUrl: `${origin}/og-image.jpg`,
  },
  pagefind: {
    path: "/pagefind/pagefind.js",
  },
  tags: {
    star: "star",
    combineThreshold: 30,
  },
  nav: {
    home: {
      key: "h",
    },
    blog: {
      key: "b",
    },
    search: {
      key: "s",
    },
    query: {
      key: "f",
    },
    older: {
      key: "ArrowRight",
      keyLabel: "→",
    },
    newer: {
      key: "ArrowLeft",
      keyLabel: "←",
    },
    top: {
      key: "t",
    },
    about: {
      key: "u",
    },
    colophon: {
      key: "c",
    },
    top: {
      key: "t",
    },
  },
};
