const HOSTNAME = 'ulfschneider.io';
const ORIGIN = `https://${HOSTNAME}`;
const BASE = '/';
const URL = ORIGIN + BASE;
const CACHE_VERSION = 'v1';

module.exports = {
    cacheVersioning: {
        runtime: `${CACHE_VERSION}-0`,
        script: `${CACHE_VERSION}-9`,
        css: `${CACHE_VERSION}-57`,
        json: `${CACHE_VERSION}-0`,
        search: `${CACHE_VERSION}-2`,
        image: `${CACHE_VERSION}-0`,
        font: `${CACHE_VERSION}-0`
    },
    name: "ulfschneider.io",
    locale: "en",
    direction: "ltr",
    theme_color: "#e7e5e4",
    dark_theme_color: "#262626",
    background_color: "#262626",
    hostname: HOSTNAME,
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
        email: "mail@ulfschneider.io",
        phone: "+49 163 2505164",
        twitter: "@ulfeed",
        mastodon: {
            user: "@ulfschneider@fosstodon.org",
            profile: "https://fosstodon.org/@ulfschneider"
        }
    },
    paginationSize: 7,
    starTag: "star",
    starTagSymbol: "★",
    mainnav: [{
        label: "Home",
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
        classList: 'no-js-hidden',
        kbd: "s"
    }
    ],
    footernav: [{
        label: "Home",
        url: BASE,
        id: "home"
    },
    {
        label: "Blog",
        url: BASE + "blog/",
        id: "blog",
        kbd: "b"
    },
    {
        label: "About",
        url: BASE + "about/",
        id: "about",
        kbd: "u"
    },
    {
        label: "Keyboard",
        url: BASE + "keyboard/",
        id: "keyboard",
        kbd: "k",
        classList: 'no-js-hidden'
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
    navNewest: {
        label: 'Newest',
        id: 'nav-first',
        kbd: ''
    },
    navNewer: {
        label: 'Newer',
        id: 'nav-newer',
        kbd: '-'
    },
    navOldest: {
        label: 'Oldest',
        id: 'nav-last',
        kbd: ''
    },
    navOlder: {
        label: 'Older',
        id: 'nav-older',
        kbd: '+',
    },
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
    input: process.env.INPUT ? process.env.INPUT : "content",
}