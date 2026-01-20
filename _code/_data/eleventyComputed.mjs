import dayjs from "dayjs"
import { execSync } from "node:child_process"

import { sortTags } from "../_11ty/collections.mjs"
import site from "./site.mjs"

const dateCache = new Map()

export default {
  layout: (data) => {
    if (data.layout == "bookmark") {
      data.docType = "bookmark"
      return "default"
    } else if (!data.layout || data.layout == "image") {
      return "default"
    } else {
      return data.layout
    }
  },
  tags: (data) => {
    if (
      (data.bookmark ||
        data.docType == "boomark" ||
        data.layout == "bookmark") &&
      (!data.tags || !data.tags.includes("bookmark"))
    ) {
      if (!data.tags) {
        data.tags = ["bookmark"]
      } else {
        data.tags.push("bookmark")
      }
    }
    return sortTags(data.tags, site.tags.star)
  },
  title: (data) => {
    if (!data.title) {
      data.title = site.title
    }
    return data.title
  },
  now: () => Date.now(),
  docType: (data) => {
    if (data.docType) {
      return data.docType
    } else if (data.bookmark == true) {
      return "bookmark"
    } else if (data.isPage) {
      return "page"
    } else if (
      data.layout == "image" ||
      data.page.inputPath.includes("/emil-drawing/") ||
      data.image == true
    ) {
      return "image"
    } else {
      return "post"
    }
  },
  isPage: (data) => {
    if (data.page.inputPath.includes("/posts/")) {
      return false
    } else {
      return true
    }
  },
  isTagIntro: (data) => {
    if (data.page.inputPath.includes("/tagintros/")) {
      return true
    } else {
      return false
    }
  },
  isPost: (data) => !data.isPage,
  permalink: (data) => {
    if (data.permalink === false) {
      return data.permalink
    } else if (data.permalink) {
      return data.permalink
    } else if (data.isTagIntro) {
      return false
    } else if (!data.isPage) {
      return `/${dayjs(data.page.date).format("YYYY-MM-DD")}-${
        data.page.fileSlug
      }/`
    } else {
      return `/${data.page.fileSlug}/`
    }
  },
  buildTime: site.buildTime,
  buildTimestamp: site.buildTimestamp,
  publishedDate: (data) => {
    return data.page.date
  },
  modifiedDate: (data) => {
    let date = dateCache.get(data.page.inputPath)
    if (site.getGitCommitDates && !date) {
      date = data.page.date

      try {
        console.log(`get git commit date for ${data.page.inputPath}`)
        const lastUpdatedFromGit = execSync(
          `git log -1 --format=%cd --date=iso -- ${data.page.inputPath}`
        )
          .toString()
          .trim()
        if (lastUpdatedFromGit) {
          date = dayjs(lastUpdatedFromGit)
        }
      } catch (err) {
        console.error(
          `Failure getting last commit date of ${data.page.inputPath}`
        )
      }
      dateCache.set(data.page.inputPath, date)
    }
    if (!date) {
      return data.page.date
    } else {
      return date
    }
  },
  published: (data) => dayjs(data.publishedDate).format("MMM D, YYYY"),
  modified: (data) => dayjs(data.modifiedDate).format("MMM D, YYYY"),
  search: (data) =>
    data.search !== false && data.draft != true ? true : false,
  rss: (data) => {
    if (data.rss === false) {
      return false
    } else if (data.norss) {
      return false
    } else {
      return true
    }
  },
  searchControl: (data) => {
    if (data.search === false) {
      return 'data-pagefind-ignore="all"'
    } else {
      return "data-pagefind-body"
    }
  }
}
