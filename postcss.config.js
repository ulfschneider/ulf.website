module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-custom-media'),
        require('postcss-calc'),
        require('autoprefixer'),
        require('postcss-discard-comments'),
        require('@fullhuman/postcss-purgecss')({
            content: [
                'content/**/*',
                '!content/**/*compose.html',
                '_includes/**/*',
                '_layouts/**/*',
                '_assets/js/**/*'
            ]
        }),
        require('cssnano')
    ]
}