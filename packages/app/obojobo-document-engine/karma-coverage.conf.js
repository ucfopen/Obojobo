// Karma configuration
// Generated on Thu Sep 01 2016 15:30:27 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // list of files / patterns to load in the browser
    files: [
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js",
      "node_modules/react/dist/react.js",
      "node_modules/react-dom/dist/react-dom.js",
      'build/obo.js',
      'build/obojobo-draft.js',
      'build/obojobo-draft-document-editor.js',
      'build/obojobo-draft-document-editor-chunks.js',
      'spec/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'build/*.js': ['coverage']
    },


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-chrome-launcher'
    ],


    // coverageReporter: {
    //   type: 'html',
    //   dir: '.coverage/'
    // },
    coverageReporter: {
      check: {
        each: {
          statements: 90
        }
      },
      reporters: [
        // { type: 'html', subdir: 'report-html' },
        { type: 'cobertura', subdir: '.', file: 'coverage.xml' }
      ],
      dir: '.coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
