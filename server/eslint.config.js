import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';

export default [
    js.configs.recommended,  // Use ESLint's recommended settings
    {
        plugins: {'@stylistic/js': stylisticJs},  // Use the plugin
        files: ['**/*.js'],  // Target JavaScript files
        languageOptions: {
            ecmaVersion: 2024,  // Using a more recent ECMAScript version
            sourceType: 'module',  // Enable ES module support
            globals: {
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                pm: 'readonly', //Allow global postman
                ...globals.node, // Allow global Node
            },
        },
        rules: {
            'no-console': 0,  // Disable console warnings
            '@stylistic/js/indent': ['error', 4],  // Use stylistic plugin's indent rule
            'linebreak-style': ['error', 'unix'],  // Enforce Unix-style line breaks
            quotes: ['error', 'single'],  // Enforce single quotes
            semi: ['error', 'always'],  // Enforce semicolons
        },
    },
];
