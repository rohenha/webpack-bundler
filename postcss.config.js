const purgecss = require('@fullhuman/postcss-purgecss')

const dev = process.env.NODE_ENV === "dev"

let config = {
  plugins: [
    'postcss-inline-svg',
    [
      'postcss-critical-css', 
      {
        outputPath: './views',
        outputDest: 'critical.twig',
        minify: true
      }
    ]
  ],
}

if (!dev) {
  config.plugins.push([
    "autoprefixer",
    {},
  ],
  )

  config.plugins.push(
    purgecss({
      content: ['./views/*.html']
    })
  )
}

module.exports = config