// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'], // [cite: 62]
    files: [
      'src/**/*.js',     // 
      'test/**/*.js'     // 
    ],
    browsers: ['ChromeHeadless'], // [cite: 66]
    singleRun: true // [cite: 69]
  });
};
