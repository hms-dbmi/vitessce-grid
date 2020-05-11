import pkg from './package.json';
import path from 'path';
import React from 'react';

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const { join } = path;

// Constants for output files:
const SRC_DIR = 'src';
const LIB_DIR = 'lib';
const ES_DIR = 'es';
const UMD_DIR = 'umd';
const INPUT_JS = 'index.js';

const ES_OUTPUT_JS = join(ES_DIR, 'index.js');
const ES_OUTPUT_MIN_JS = join(ES_DIR, 'index.min.js');
const LIB_OUTPUT_JS = join(LIB_DIR, 'index.js');
const LIB_OUTPUT_MIN_JS = join(LIB_DIR, 'index.min.js');
const UMD_OUTPUT_JS = join(UMD_DIR, 'vitessce-grid.js');
const UMD_OUTPUT_MIN_JS = join(UMD_DIR, 'vitessce-grid.min.js');

const isProduction = process.env.NODE_ENV === 'production';

const outputBase = {
    sourcemap: true,
    globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    }
};

export default {
    input: join(SRC_DIR, INPUT_JS),
    output: [
        {
            format: 'es',
            file: (isProduction ? ES_OUTPUT_MIN_JS : ES_OUTPUT_JS),
            ...outputBase
        },
        {
            format: 'cjs',
            file: (isProduction ? LIB_OUTPUT_MIN_JS : LIB_OUTPUT_JS),
            ...outputBase
        },
        {
            name: pkg.name,
            format: 'umd',
            file: (isProduction ? UMD_OUTPUT_MIN_JS : UMD_OUTPUT_JS),
            ...outputBase
        }
    ],
    plugins: [
        // Tell Rollup how to resolve packages in node_modules.
        // Reference: https://github.com/rollup/plugins/tree/master/packages/commonjs#using-with-rollupplugin-node-resolve
        resolve({
            browser: true,
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
        // Note: This plugin respects Babel config files by default.
        // Reference: https://github.com/rollup/plugins/tree/master/packages/babel
        babel({
            // The 'runtime' option is recommended when bundling libraries.
            // Reference: https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
            babelHelpers: 'runtime',
            // Only transpile our source code.
            // Reference: https://github.com/rollup/plugins/tree/master/packages/babel#extensions
            exclude: 'node_modules/**'
        }),
        ...(isProduction ? [
            terser()
        ] : [])
    ],
    // We do not to inclue React or ReactDOM in the bundle.
    external: ['react', 'react-dom']
};