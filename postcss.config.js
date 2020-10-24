module.exports = {
    plugins: [
        require('postcss-custom-media'),
        require('postcss-calc'),
        require('autoprefixer'),
        require('postcss-import'),
        require('postcss-discard-comments'),
        require('cssnano')
    ]
}