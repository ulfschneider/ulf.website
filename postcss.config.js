module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-discard-comments'),
    require('cssnano')({
      preset: 'default',
    })
  ]
}