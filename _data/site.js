const ORIGIN = "https://ulf.codes";
const BASE = "/";
const URL = ORIGIN + BASE;

module.exports = {
    name: "ulf.codes",
    locale: "en",
    direction: "ltr",
    theme_color: "#ebebeb",
    dark_theme_color: "#3a3a3a",
    background_color: "#3a3a3a",
    origin: ORIGIN,    
    base: BASE,
    url: URL,
    offline: BASE + "offline/",
    buildTime: new Date(), 
    imgMaxWidth: 1024,
    imgMaxHeight: 700,
    imgSmallWidth: 400,
    imgSmallHeight: 300,
    imgSmallPostfix: "-sm",
    imgQuality: 80,
    excerptWordCount: 25,
    title: "Ulf Schneider – Developer and Agile Coach",
    description: "Hi, I´m Ulf Schneider, a developer and agile coach living in Paderborn, Germany.",
    ownership: {
        name: "Ulf Schneider",
        email: "mail@ulf.codes",
        phone: "+49 163 2505164",
        twitter: ""
    },
    paginationSize: 10,
    starTag: "star",
    starTagSymbol: "★",
    /*tagColors: ["#2b7296", "#94322d", "#2a9754", "#7e761d", "#1d7d76", "#761d7d"],*/
    mainnav: [{
            label: "Ulf Schneider",
            url: BASE,
            id: "home",
            kbd: "h"
        },
        {
            label: "Blog",
            url: BASE + "blog/",
            id: "blog",
            kbd: "b"
        },
        {
            label: "Search",
            url: BASE + "search/",
            id: "search",
            kbd: "s"
        }
    ],
    footernav: [{
            label: "Home",
            url: BASE,
            id: "home"
        },
        {
            label: "About",
            url: BASE + "about/",
            id: "about",
            kbd: "u"
        },
        {
            label: "Accessibility",
            url: BASE + "accessibility-statement/",
            id: "accessibility",
            kbd: "a"
        },
        {
            label: "Colophon",
            url: BASE + "colophon/",
            id: "colophon",
            kbd: "c"
        },
        {
            label: "RSS",
            url: BASE + "feed.xml",
            id: "rss",
            kbd: "r"
        },
        {
            label: "Edit on GitHub",
            id: "editOnGitHub",
            url: "https://github.com/ulfschneider/11ty.ulf.codes/edit/master/",
            kbd: "e"
        }
    ],
    tagnav: [{
            tag: "emil-drawing",
            url: BASE + "images/emil-drawing/"
        },
        {
            tag: "*",
            url: BASE + "blog/*/"
        },
        {
            tag: "",
            url: BASE + "blog/"
        }
    ],
    backToTop: {
        label: "Back to Top",
        id: "start",
        kbd: "t"
    },
    search: {
        url: BASE + "search/",
        kbd: "s"
    },
    blog: BASE + "blog/",
    images: BASE + "images/",
    rss: BASE + "feed.xml",
    output: process.env.OUTPUT ? process.env.OUTPUT : "_site",
    input: process.env.INPUT ? process.env.INPUT : "content"
}