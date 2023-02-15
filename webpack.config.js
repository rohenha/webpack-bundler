const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const SpritePlugin = require('extract-svg-sprite-webpack-plugin');

const dev = process.env.NODE_ENV === "dev"

let config = {
  // Point d'entrée de webpack
  entry: [
    './sources/scripts/site.js',
    './sources/styles/site.scss',
    // './sources/sprites/youtube.svg',
  ],
  // entry: {
    // site: ['./sources/scripts/site.js', './sources/styles/site.scss']
  // },
	// Si on veux avoir un écouteur
  watch: dev,
  devtool: dev ? "eval-cheap-module-source-map" : false,
	// Mode de webpack
  mode: dev ? 'development' : 'production',
  // Partie sortie du code
  output: {
    path: path.resolve('./views/assets'),
    filename:  dev ? '[name].js' : '[name].[contenthash].js',
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
          // SpritePlugin.cssLoader,
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
        use: [
          SpritePlugin.loader
        ]
      }, 
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: [
      //     'babel-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    // To extract CSS from JS
    new MiniCssExtractPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash].css'
    }),
    // To create manifest file
    new WebpackManifestPlugin({}),
    // Create Sprites
    new SpritePlugin({
      // filename: 'views/sprite.svg',
      symbolId: 'icon-'
    })
  ],
}

if (!dev) {
  config.optimization = {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin(),
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