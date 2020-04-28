// Based on https://github.com/pschroen/rollup-plugin-glslify
// Uses glslify CLI instead of JavaScript API, because the former compiles my shaders correctly while the latter doesn't.

'use strict';

const { createFilter } = require('rollup-pluginutils');

const { execSync } = require('child_process');
const path = require('path');

function compile(code, options) {
    return execSync('$(npm bin)/glslify', {
        encoding: 'utf-8',
        cwd: options.basedir,
        input: code,
    });
}

export default function glslify(userOptions = {}) {
    const options = Object.assign({
        include: [
            '**/*.vs',
            '**/*.fs',
            '**/*.vert',
            '**/*.frag',
            '**/*.glsl'
        ]
    }, userOptions);

    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'rollup-plugin-glslify-cli',
        transform(code, id) {
            if (!filter(id)) return;

            options.basedir = options.basedir || path.dirname(id);

            return {
                code: `export default ${JSON.stringify(compile(code, options))}; // eslint-disable-line`,
                map: { mappings: '' }
            };
        }
    };
};
