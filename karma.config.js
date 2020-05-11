process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

const rollupConfig = require('./rollup.config.demo');
// TODO: should the dev server plugins be removed from the rollup config here?

module.exports = config => {
  config.set({
    plugins: [
        'karma-mocha',
        'karma-sourcemap-loader',
        'karma-chrome-launcher',
        'karma-mocha-reporter',
        // Reference: https://github.com/jlmakes/karma-rollup-preprocessor
        require('karma-rollup-preprocessor')
    ],
    basePath: 'src/',
    files: [
        // Rollup preprocessor does its own watching.
        // Reference: https://github.com/jlmakes/karma-rollup-preprocessor
        { pattern: '**/*.test.js', watched: false },
    ],
    preprocessors: {
      '**/*.js': ['rollup', 'sourcemap'],
    },
    rollupPreprocessor: rollupConfig,
    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: ['ChromeLauncher'],
    customLaunchers: {
        // Use a custom launcher to be able to configure with flags.
        ChromeLauncher: {
            base: 'Chrome',
            flags: [
                '--no-sandbox'
            ]
            // Note: would be cleaner with ChromeHeadless
            // but cannot figure out how to disable network caching using the flags array.
            // Tried: --disk-cache-dir=/dev/null --disk-cache-size=1
        }
    },
    logLevel: config.LOG_DEBUG,
    captureTimeout: 60000,
    port: 9876,
    colors: true
  });
};
