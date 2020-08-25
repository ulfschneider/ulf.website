module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-discard-comments'),
    require('cssnano')({
      preset: 'default',
    })
  ]
}