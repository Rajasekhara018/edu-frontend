module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('jasmine-core'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: { clearContext: false },
    coverageReporter: { dir: require('path').join(__dirname, './coverage'), reporters: [{ type: 'html' }, { type: 'text-summary' }] },
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
