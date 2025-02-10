import "dotenv/config";
import chalk from "chalk";
const environment = process.env.DEV ? "DEV" : "PRD";
const hostname = environment == "DEV" ? "localhost:8080" : "ulfschneider.io";
const origin =
  environment == "DEV" ? `http://${hostname}` : `http://${hostname}`;
const buildTime = new Date();

function deriveVersion(version) {
  return environment == "DEV" ? "" : `-${version}`;
}

function useServiceWorker() {
  if (environment == "DEV") {
    console.log(
      chalk.yellow(
        "Not registering service worker because of local dev environment",
      ),
    );
    return false;
  }
  return true;
}

function getGitCommitDates() {
  if (environment == "DEV") {
    console.log(
      chalk.yellow(
        "Not getting git commit dates because of local dev environment",
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
  environment: environment,
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
    deriveVersion: deriveVersion,
    version: {
      script: deriveVersion(1),
      html: deriveVersion(1),
      json: deriveVersion(1),
      image: deriveVersion(1),
      font: deriveVersion(1),
      css: deriveVersion(1),
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
