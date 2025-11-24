// karma.conf.cjs
// Purpose: Configure Karma + Jasmine for Angular unit tests.
//
// - Local dev: run tests visually in Firefox.
//     Command: `npm test`  (or `ng test`)
// - CI (Jenkins): run tests in headless Firefox.
//     Command: `npx ng test --watch=false --browsers=FirefoxHeadless --single-run`
//
// The "FirefoxHeadless" launcher here is based on normal Firefox with -headless.

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
      // Keep the Jasmine Spec Runner output visible in the browser (for local dev)
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

    // Watch files and re-run tests on changes (good for local dev)
    autoWatch: true,

    // Default browser for local development: normal Firefox (non-headless)
    browsers: ['Firefox'],

    // Local dev: keep Karma running and re-run on changes.
    // CI will override this via CLI with --single-run.
    singleRun: false,

    // Extra CI-friendly launcher: headless Firefox
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
    },

    // Re-run tests when files change
    restartOnFileChange: true,
  });
};