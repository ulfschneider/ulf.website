module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-custom-media'),
        require('postcss-custom-properties')({
            preserve: false
        }),
        require('postcss-calc'),
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
            whitelistPatternsChildren: [/^token/, /^pre/, /^code/],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [] //check https://flaviocopes.com/tailwind-setup/
        }),
        require('cssnano')
    ]
}