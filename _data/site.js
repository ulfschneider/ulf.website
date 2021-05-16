module.exports = {
    name: "ulf.codes",
    locale: "en",
    themecolor: "#00bbff",
    url: "https://ulf.codes",
    imgMaxWidth: 700,
    imgMaxHeight: undefined,
    jpegQuality: 80,
    instantPage: true,
    excerptWordCount: 25,
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
            url: '/feed.xml',
            id: 'rss',
            kbd: 'r'
        },
        {
            label: 'Accessibility',
            url: '/accessibility/',
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
            label: 'About',
            url: '/about/',
            id: 'about',
            kbd: 'u'
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

    time: new Date()
}