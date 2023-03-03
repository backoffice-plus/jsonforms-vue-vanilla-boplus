import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    // If our .vue files have a style, it will be compiled as a single `.css` file under /dist.
    plugins: [
        Vue(/*{ style: { filename: 'style.css' } }*/),
        visualizer({
            filename: resolve(__dirname, 'stats.html'),
            template: 'treemap', // sunburst|treemap|network
            sourcemap: true
        }),
    ],

    build: {
        // Output compiled files to /dist.
        outDir: './dist',
        lib: {
            // Set the entry point (file that contains our components exported).
            entry: resolve(__dirname, 'src/index.ts'),
            // Name of the library.
            name: 'jsonforms-vue-vanilla-boplus',
            // We are building for CJS and ESM, use a function to rename automatically files.
            // Example: my-component-library.esm.js
            fileName: (format) => `${'jsonforms-vue-vanilla-boplus'}.${format}.js`,
        },
        rollupOptions: {
            // Vue is provided by the parent project, don't compile Vue source-code inside our library.
            external: ['vue'],
            output: {
                globals: { vue: 'Vue' },
                sourcemap: true
            },
        },
    },

    test: {}
})
