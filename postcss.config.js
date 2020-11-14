module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-discard-comments'),
    require('postcss-purgecss')({
      content: ['./_site/**/*.html', './content/**/*.html']
    }),    
    require('cssnano')({
      preset: 'default',
    })
  ]
}