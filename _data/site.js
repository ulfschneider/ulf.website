
module.exports = {
    name: "ulf.codes",
    locale: "en",
    themecolor: "#00bbff",
    url: "https://ulf.codes",
    imgMaxWidth: 600,
    imgMaxHeight: undefined,
    jpegQuality: 80,
    title: "Ulf Schneider – Developer and Agile Coach",
    description: "Hi, I´m Ulf Schneider, a developer and agile coach living in Paderborn, Germany.",
    author: {
        name: "Ulf Schneider",
        email: "mail@ulf.codes",
        emailUser: "mail",
        emailDomain: "ulf.codes"
    },
    mainnav: [
        {
            label: 'Ulf Schneider',
            url: '/',
            id: 'home'
        },
        {
            label: 'Blog',
            url: '/blog/',
            id: 'blog'
        },
        {
            label: 'Search',
            url: '/search/',
            id: 'search'
        }
    ],
    footernav: [
        {
            label: 'RSS',
            url: '/rss.xml',
            id: 'rss'
        },
        {
            label: 'Colophon',
            url: '/colophon/',
            id: 'colophon'
        },
        {
            label: 'Ownership',
            url: '/ownership/',
            id: 'ownership'

        }
    ],
    tagnav: [
        'reading',
        'articles',
        'tools',
        'journal'
    ],

    search: '/search/',
    blog: '/blog/',
    images: '/images/',
    rss: '/rss.xml',
    time: new Date()
}