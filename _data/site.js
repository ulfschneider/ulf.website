module.exports = {
    name: "ulf.codes",
    locale: "en",
    themecolor: "#00bbff",
    url: "https://ulf.codes",
    imgMaxWidth: 700,
    imgMaxHeight: undefined,
    jpegQuality: 80,
    instantPage: true,
    title: "Ulf Schneider – Developer and Agile Coach",
    description: "Hi, I´m Ulf Schneider, a developer and agile coach living in Paderborn, Germany.",
    ownership: {
        name: "Ulf Schneider",
        email: "mail@ulf.codes",
        phone: "+49 163 2505164",
        twitter: ""
    },
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
            label: 'RSS',
            url: '/rss.xml',
            id: 'rss',
            kbd: 'r'
        },
        {
            label: 'Colophon',
            url: '/colophon/',
            id: 'colophon',
            kbd: 'c'
        },
        {
            label: 'About',
            url: '/about/',
            id: 'about',
            kbd: 'a'

        }
    ],
    tagnav: [
        'reading',
        'accessibility',
        'agile',
        'tools',
        'journal'
    ],

    search: '/search/',
    blog: '/blog/',
    images: '/images/',
    rss: '/rss.xml',
    searchKey: 's',
    time: new Date()
}