module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-calc'),
        require('postcss-custom-media'),
        require('@fullhuman/postcss-purgecss')({
            content: [
                'content/pages/**/*',
                'content/posts/**/*',
                '!content/**/*compose.html',
                '_includes/**/*',
                '_layouts/**/*',
                '_assets/js/**/*',
                '_assets/css/customize.css'
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [] //check https://flaviocopes.com/tailwind-setup/
        }),
        require('cssnano')
    ]
}