module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-discard-comments'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: ['./**/*.html']
    })
  ]
}