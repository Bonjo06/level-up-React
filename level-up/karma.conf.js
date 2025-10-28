// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'webpack'], // Mantener webpack aquí

    files: [
      'src/setupTests.js',
      { pattern: 'src/**/*.test.js', watched: false }
    ],

    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: {
      mode: 'development',
      experiments: {
        outputModule: true,
      },
      output: {
        module: true,
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      },
      devtool: 'inline-source-map'
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    // --- CAMBIO AQUÍ ---
    browsers: ['ChromeHeadless'], // Cambiado de 'Edge' a 'ChromeHeadless'
    // --- FIN CAMBIO ---

    singleRun: false,
    reporters: ['progress'],
    browserNoActivityTimeout: 60000 // Mantener tiempo de espera aumentado
  });
};