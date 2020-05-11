import pkg from './package.json';
import path from 'path';
import React from 'react';

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import replace from '@rollup/plugin-replace';
import scss from 'rollup-plugin-scss';

// Dev server
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { htmlFromTemplate } from './rollup.utils';

const { join } = path;

// Constants for output files:
const SRC_DIR = 'src';
const LIB_DIR = 'lib';
const ES_DIR = 'es';
const CSS_DIR = 'css';
const UMD_DIR = 'umd';
const DEMO_DIR = 'demo';
const DEMO_SRC_DIR = join(DEMO_DIR, 'src');
const DEMO_DIST_DIR = join(DEMO_DIR, 'dist');
const INPUT_JS = 'index.js';
const OUTPUT_JS = 'demo.js';
const OUTPUT_CSS = 'demo.css';
const OUTPUT_HTML = 'index.html';

export default {
    input: join(DEMO_SRC_DIR, INPUT_JS),
    output: {
        file: join(DEMO_DIST_DIR, OUTPUT_JS),
        sourcemap: true,
        format: 'umd',
    },
    plugins: [
        // Tell Rollup how to resolve packages in node_modules.
        // Reference: https://github.com/rollup/plugins/tree/master/packages/commonjs#using-with-rollupplugin-node-resolve
        resolve({
            browser: true,
        }),
        // Tell Rollup how to handle CSS imports.
        scss({
            output: join(DEMO_DIST_DIR, OUTPUT_CSS),
        }),
        // Tell Rollup how to handle JSON imports.
        json(),
        // Need to convert CommonJS modules in node_modules to ES6.
        // Reference: https://github.com/rollup/plugins/tree/master/packages/node-resolve#using-with-rollupplugin-commonjs
        commonjs({
            // Using this RegEx rather than 'node_modules/**' is suggested, to enable symlinks.
            // Reference: https://github.com/rollup/plugins/tree/master/packages/commonjs#usage-with-symlinks
            include: /node_modules/,
            namedExports: {
                // Need to explicitly tell Rollup how to handle imports like `React, { useState }`
                // Reference: https://github.com/rollup/rollup-plugin-commonjs/issues/407#issuecomment-527837831
                // Reference: https://github.com/facebook/react/issues/11503
                'node_modules/react/index.js': Object.keys(React)
            }
        }),
        // Tell Rollup to compile our source files with Babel.
        // This plugin respects Babel config files by default.
        // Reference: https://github.com/rollup/plugins/tree/master/packages/babel
        babel({
            // The 'bundled' option is recommended when bundling full applications (rather than libraries).
            // Reference: https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
            babelHelpers: 'bundled',
            // Only transpile our source code.
            // Reference: https://github.com/rollup/plugins/tree/master/packages/babel#extensions
            exclude: 'node_modules/**'
        }),
        replace({
            // React uses process.env to determine whether a development or production environment.
            // Reference: https://github.com/rollup/rollup/issues/487#issuecomment-177596512
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        // We want Rollup to generate an HTML file for the demo.
        html({
            // The following option provides
            title: `${pkg.name} demo`,
            // Our demo expects to find the element <div id="demo"></div>.
            // We need to use a custom templating function to override the default HTML output.
            // Reference: https://github.com/rollup/plugins/tree/master/packages/html#template
            template: htmlFromTemplate,
        }),
        serve({
            port: 8000,
            contentBase: DEMO_DIST_DIR
        }),
        livereload(DEMO_DIST_DIR)
    ],
    // We do not want to declare any externals.
    // The demo needs React and ReactDOM even though these are externals for the library output.
    externals: []
};