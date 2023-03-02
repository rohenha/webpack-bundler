const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const glob = require("glob")

const dev = process.env.NODE_ENV === "dev"

let config = {
  // Point d'entrée de webpack
  entry: [
    './sources/scripts/site.js',
    './sources/styles/site.scss',
    ... glob.sync('./sources/sprites/*.svg')
  ],
	// Si on veux avoir un écouteur
  watch: dev,
  devtool: dev ? "eval-cheap-module-source-map" : false,
	// Mode de webpack
  mode: dev ? 'development' : 'production',
  // Partie sortie du code
  output: {
    path: path.resolve('./views/assets'),
    filename:  dev ? 'site.js' : 'site.[contenthash].js',
    clean: true,
    // assetModuleFilename: '[name].[contenthash][ext]'
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve('.tmp'),
  },
  // Pour les loaders
  module: {
    generator: {
      'asset/resource': {
        filename: './[name].[contenthash][ext]',
      },
    },
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              // JavaScript version to compile to
              target: 'es2015',
            }
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          'webpack-import-glob-loader',
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: './assets/images/',
          outputPath: 'images/',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: './assets/fonts/',
          outputPath: 'fonts/',
        }
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, './sources/sprites'),
        use: [
          { 
            loader: 'svg-sprite-loader', 
            options: {
              extract: true,
              spriteFilename: svgPath => `sprite.twig`,
              outputPath: '../',
              publicPath: '/'
            }
          },
        ]
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader',
        options: {
          // glsl: {
          //   chunkPath: resolve("/glsl/chunks")
          // }
        }
      }
    ]
  },
  plugins: [
    // To extract CSS from JS
    new MiniCssExtractPlugin({
      filename: dev ? 'site.css' : 'site.[contenthash].css'
    }),
    // To create manifest file
    new WebpackManifestPlugin({}),
    // Create Sprites
    new SpriteLoaderPlugin({
      plainSprite: true,
      spriteAttrs: {}
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      // server: { baseDir: ['views'] },
      proxy: 'http://graphikart-webpack.vm/'
    }),
    // copy files
    new CopyPlugin({
      patterns: [
        { from: "sources/assets", to: "./" },
      ],
    }),
  ],
}

if (!dev) {
  config.optimization = {
    usedExports: true,
    minimize: true,
    minimizer: [
      // Plugin pour minimiser le CSS
      new TerserPlugin(),
      // Plugin pour minimiser le CSS
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.cssoMinify,
        minimizerOptions: {
          comments: false
        },
      }),
    ],
  }

  // To add Gzip compression
  config.plugins.push(new CompressionPlugin({}))
}

module.exports = config