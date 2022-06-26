module.exports = {
    name: "ulf.codes",
    locale: "en",
    themeColor: "",
    url: "https://ulf.codes",
    buildTime: new Date(),
    imgMaxWidth: 1024,
    imgMaxHeight: 700,
    imgSmallWidth: 400,
    imgSmallHeight: 300,
    imgSmallPostfix: '-sm',
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
    starTag: "star",
    starTagSymbol: "★",
    /*tagColors: ['#2b7296', '#94322d', '#2a9754', '#7e761d', '#1d7d76', '#761d7d'],*/
    mainnav: [{
            label: 'Ulf Schneider',
            url: '/',
            id: 'home',
            kbd: 'h'
        },
        {
            label: 'Blog',
            url: '/blog/',
            id: 'blog',
            kbd: 'b'
        },
        {
            label: 'Search',
            url: '/search/',
            id: 'search',
            kbd: 's'
        }
    ],
    footernav: [{
            label: 'Home',
            url: '/',
            id: 'home'
        },
        {
            label: 'About',
            url: '/about/',
            id: 'about',
            kbd: 'u'
        },
        {
            label: 'Accessibility',
            url: '/accessibility-statement/',
            id: 'accessibility',
            kbd: 'a'
        },
        {
            label: 'Colophon',
            url: '/colophon/',
            id: 'colophon',
            kbd: 'c'
        },
        {
            label: 'RSS',
            url: '/feed.xml',
            id: 'rss',
            kbd: 'r'
        },
        {
            label: 'Edit on GitHub',
            id: 'editOnGitHub',
            url: 'https://github.com/ulfschneider/11ty.ulf.codes/edit/master/',
            kbd: 'e'
        }
    ],
    tagnav: [{
            tag: 'emil-drawing',
            url: '/images/emil-drawing/'
        },
        {
            tag: '*',
            url: '/blog/*/'
        },
        {
            tag: '',
            url: '/blog/'
        }
    ],
    backToTop: {
        label: 'Back to Top',
        id: 'start',
        kbd: 't'
    },
    search: {
        url: '/search/',
        kbd: 's'
    },
    blog: '/blog/',
    images: '/images/',
    rss: '/feed.xml',
    output: process.env.OUTPUT ? process.env.OUTPUT : '_site',
    input: process.env.INPUT ? process.env.INPUT : 'content'
}