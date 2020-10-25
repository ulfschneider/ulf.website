module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-calc'),
        require('postcss-custom-media'),
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