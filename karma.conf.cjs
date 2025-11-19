// Purpose: Configure Karma + Jasmine for Angular unit tests and run them in Firefox.

module.exports = function (config) {
  config.set({
    // Root path for resolving files
    basePath: '',

    // Testing frameworks
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // Plugins used by Karma
    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],

    client: {
      // Keep the Jasmine Spec Runner output visible in the browser
      clearContext: false,
    },

    // Where to write coverage information
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/orderflow-cloud-frontend'),
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
      ],
    },

    // Reporters for test results
    reporters: ['progress', 'kjhtml'],

    // Web server port
    port: 9876,

    // Console output
    colors: true,
    logLevel: config.LOG_INFO,

    // Watch files and re-run tests on changes
    autoWatch: true,

    // IMPORTANT: run tests in Firefox instead of Chrome
    browsers: ['Firefox'],

    // Keep Karma running (watch mode) by default
    singleRun: false,

    // Re-run tests when files change
    restartOnFileChange: true,
  });
};