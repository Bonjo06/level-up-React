// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'], 

    // Solo dile a Webpack dónde están los tests
    files: [
      { pattern: 'src/**/*.test.js', watched: false } 
    ],

    // Preprocesa los tests con Webpack y genera sourcemaps
    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap'] 
    },

    // Configuración de Webpack para Karma
    webpack: {
      mode: 'development', 
      module: {
        rules: [
          { // Regla para archivos JS/JSX
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'] 
              }
            }
          },
          { // Regla para CSS (si los necesitas)
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx'] 
      },
      devtool: 'inline-source-map' // Mejores sourcemaps
    },

    // Reduce el ruido de Webpack en la consola
    webpackMiddleware: {
      stats: 'errors-only'
    },

    browsers: ['Edge'], // O 'EdgeHeadless'
    singleRun: true, 
    reporters: ['progress'] 
  });
};