const dev = process.env.NODE_ENV === "dev"

let config = {
  plugins: [
    
  ],
}

if (!dev) {
  config.plugins.push([
    "autoprefixer",
    {
      // browsers: ['last 2 versions'],
    },
  ])
}

module.exports = config