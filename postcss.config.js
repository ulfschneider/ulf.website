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
                '_assets/js/**/*'
            ],

            defaultExtractor: content => {
                // Capture as liberally as possible, including things like `h-(screen-1.5)`
                const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
                    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
                const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
                return broadMatches.concat(innerMatches)
            }
        }),
        require('cssnano')
    ]
}