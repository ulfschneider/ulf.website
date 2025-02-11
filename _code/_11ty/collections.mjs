import dayjs from "dayjs";
import path from "node:path";
import site from "../_data/site.mjs";

const tagIntros = new Map();

function bringItemToFront(arr, item) {
  const itemIdx = arr.indexOf(item);

  if (itemIdx >= 0) {
    return [
      arr[itemIdx],
      ...[...arr.slice(0, itemIdx), ...arr.slice(itemIdx + 1)],
    ];
  }
  return arr;
}

export function sortTags(tags) {
  if (Array.isArray(tags)) {
    const star = site.tags.star;
    tags = [...new Set(tags).values()].sort();
    tags = bringItemToFront(tags, star);
    tags = bringItemToFront(tags, "");
  }
  return tags;
}

export function isGallery(tag) {
  const tagIntro = tagIntros.get(tag);
  if (tagIntro) {
    return tagIntro.gallery;
  }
  return false;
}

function readTagIntros(collectionsApi, markdownLib) {
  collectionsApi.getFilteredByGlob("content/tagintros/**").forEach((item) => {
    const tag = path.basename(item.page.filePathStem);
    if (!tagIntros.has(tag)) {
      const intro = {
        title: item.data.title,
        content: markdownLib.render(item.rawInput),
        gallery: item.data.gallery == true ? true : false,
      };
      if (tag == "blog") {
        tagIntros.set("", intro);
      } else {
        tagIntros.set(tag, intro);
      }
    }
  });
}

export function getItemsByTagAndYear(collection, collectionsApi, markdownLib) {
  function initData(tag = "", year = "") {
    const data = {
      tag: tag,
      year: year,
      items: [],
    };
    if (tag && year) {
      data.key = `/${tag}/${year}/`;
    } else if (tag) {
      data.key = `/${tag}/`;
    } else if (year) {
      data.key = `/${year}/`;
    } else {
      data.key = "/";
    }
    return data;
  }

  function combineItemsForTag(dataByTagAndYear, tag) {
    const result = initData(tag);
    result.fromYear = "";
    result.toYear = "";

    const years = Object.keys(dataByTagAndYear[tag]).reverse();
    if (years.length > 1) {
      result.multipleYears = true;
    }
    for (const year of years) {
      result.items.push(...dataByTagAndYear[tag][year].items);
      if (!result.tagIntro) {
        result.tagIntro = dataByTagAndYear[tag][year].tagIntro;
      }
      if (!result.fromYear) {
        result.fromYear = year;
      }
      result.toYear = year;
    }

    return result;
  }

  function injectTagIntros(dataByTagAndYear) {
    readTagIntros(collectionsApi, markdownLib);

    for (const tag in dataByTagAndYear) {
      const tagIntro = tagIntros.get(tag);
      if (tagIntro) {
        for (const year in dataByTagAndYear[tag]) {
          dataByTagAndYear[tag][year].tagIntro = tagIntro.content;
        }
      }
    }
  }

  function getTitle(dataByTagAndYear, tag) {
    if (dataByTagAndYear.multipleYears) {
      if (tag) {
        return `${dataByTagAndYear.fromYear} – ${dataByTagAndYear.toYear}: Posts tagged #${tag}`;
      } else {
        return `${dataByTagAndYear.fromYear} – ${dataByTagAndYear.toYear}: All posts`;
      }
    } else {
      if (tag) {
        return `${dataByTagAndYear.year}: Posts tagged #${tag}`;
      } else {
        return `${dataByTagAndYear.year}: All posts`;
      }
    }
  }

  function formatResults(dataByTagAndYear) {
    const itemsByTagAndYear = {};
    for (const tag in dataByTagAndYear) {
      const combinedItems = combineItemsForTag(dataByTagAndYear, tag);
      let itemsForMostCurrentYear;

      if (
        combinedItems.multipleYears &&
        combinedItems.items.length <= site.tags.combineThreshold
      ) {
        itemsForMostCurrentYear = combinedItems;
      } else {
        itemsForMostCurrentYear = Object.values(dataByTagAndYear[tag]).at(-1);
      }
      itemsForMostCurrentYear.title = getTitle(itemsForMostCurrentYear, tag);
      if (tag) {
        itemsByTagAndYear[`/${tag}/`] = itemsForMostCurrentYear;
      } else {
        itemsByTagAndYear["/"] = itemsForMostCurrentYear;
      }

      const yearsForTag = Object.keys(dataByTagAndYear[tag]);
      dataByTagAndYear[tag][yearsForTag.at(0)].isOldest = true;
      dataByTagAndYear[tag][yearsForTag.at(-1)].isNewest = true;

      for (const [index, year] of yearsForTag.entries()) {
        const key = dataByTagAndYear[tag][year].key;

        itemsByTagAndYear[key] = dataByTagAndYear[tag][year];
        itemsByTagAndYear[key].pageIndex = yearsForTag.length - index;
        itemsByTagAndYear[key].pageCount = yearsForTag.length;
        itemsByTagAndYear[key].title = getTitle(itemsByTagAndYear[key], tag);

        if (index + 1 < yearsForTag.length) {
          itemsByTagAndYear[key].newer =
            dataByTagAndYear[tag][yearsForTag[index + 1]];
          itemsByTagAndYear[key].newest =
            dataByTagAndYear[tag][yearsForTag.at(-1)];
        }
        if (index > 0) {
          itemsByTagAndYear[key].older =
            dataByTagAndYear[tag][yearsForTag[index - 1]];
          itemsByTagAndYear[key].oldest =
            dataByTagAndYear[tag][yearsForTag.at(0)];
        }
      }
    }
    return itemsByTagAndYear;
  }

  const dataByTagAndYear = {};
  collection.forEach((item) => {
    //iterate through all items of the given collection
    //and create a traversable data structure

    const year = dayjs(item.data.publishedDate).format("YYYY");

    if (!dataByTagAndYear[""]) {
      dataByTagAndYear[""] = {};
    }
    if (!dataByTagAndYear[""][year]) {
      dataByTagAndYear[""][year] = initData("", year);
    }
    dataByTagAndYear[""][year].items.push(item);

    if (item.data.tags) {
      for (const tag of item.data.tags) {
        if (!dataByTagAndYear[tag]) {
          dataByTagAndYear[tag] = {};
        }
        if (!dataByTagAndYear[tag][year]) {
          dataByTagAndYear[tag][year] = initData(tag, year);
        }
        dataByTagAndYear[tag][year].items.push(item);
      }
    }
  });

  injectTagIntros(dataByTagAndYear);

  return formatResults(dataByTagAndYear);
}

function extractFirstImageTag(html) {
  if (html) {
    const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
    if (match) {
      return match[0];
    }
  }
}

function firstImage(html) {
  const firstImg = extractFirstImageTag(html);
  let src = "";
  let alt = "";
  if (firstImg) {
    src = getAttr(firstImg, "src") || "";
    alt = getAttr(firstImg, "alt") || "";
  }
  if (src) {
    return {
      src: src,
      alt: alt,
    };
  }
}

export function openGraphImage(html) {
  const firstImg = firstImage(html);

  if (firstImg) {
    const ext = path.extname(firstImg.src).toLowerCase();

    if (
      firstImg.src.indexOf(site.origin) == -1 &&
      firstImg.src.indexOf("//") == -1 &&
      (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif")
    ) {
      return {
        src: site.origin + firstImg.src,
        alt: firstImg.alt,
      };
    }
  }
  return {
    src: site.openGraph.imgUrl,
    alt: "",
  };
}

export function getAttr(html, attr) {
  if (html) {
    const match = html.match(new RegExp(`${attr}="(.*?)"`, "i"));
    if (match) {
      return match[1];
    }
  }
}

export function isLive(content) {
  return content.data.draft != true && content.data.isPost;
}

export function getImagesByTag(collection, collectionsApi, markdownLib) {
  function initData(tag = "") {
    const data = {
      tag: tag,
      items: [],
    };
    if (tag) {
      data.key = `/${tag}/`;
    } else {
      data.key = "/";
    }
    return data;
  }

  function getMaxYear(a, b) {
    if (a && b) {
      return Math.max(parseInt(a), parseInt(b)).toString();
    } else if (a) {
      return a;
    } else if (b) {
      return b;
    }
  }

  function getMinYear(a, b) {
    if (a && b) {
      return Math.min(parseInt(a), parseInt(b)).toString();
    } else if (a) {
      return a;
    } else if (b) {
      return b;
    }
  }

  function formatResults(dataByTag) {
    const imagesByTag = {};
    for (const tag in dataByTag) {
      const key = dataByTag[tag].key;
      imagesByTag[key] = dataByTag[tag];

      if (!dataByTag[tag].multipleYears) {
        imagesByTag[key].year = imagesByTag[key].fromYear;
        imagesByTag[key].title =
          `${imagesByTag[key].year}: Images tagged #${tag}`;
      } else {
        imagesByTag[key].title =
          `${imagesByTag[key].fromYear} – ${imagesByTag[key].toYear}: Images tagged #${tag}`;
      }
    }
    return imagesByTag;
  }

  readTagIntros(collectionsApi, markdownLib);

  const dataByTag = {};
  for (const tag of tagIntros.keys()) {
    collection.forEach((item) => {
      //iterate through all items of the given collection
      //and create a traversable data structure
      if (item.data.tags.includes(tag)) {
        if (!dataByTag[tag]) {
          dataByTag[tag] = initData(tag);
          dataByTag[tag].tagIntro = tagIntros.get(tag).content;
        }
        const img = firstImage(markdownLib.render(item.rawInput));
        if (img) {
          img.url = item.url;
          img.title = item.data.title;
          img.year = dayjs(item.data.publishedDate).format("YYYY");
          dataByTag[tag].items.push(img);
          dataByTag[tag].fromYear = getMaxYear(
            dataByTag[tag].fromYear,
            img.year,
          );
          dataByTag[tag].toYear = getMinYear(dataByTag[tag].toYear, img.year);
          dataByTag[tag].multipleYears =
            dataByTag[tag].fromYear != dataByTag[tag].toYear;
        }
      }
    });
  }

  return formatResults(dataByTag);
}
