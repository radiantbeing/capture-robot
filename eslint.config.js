/*jslint node */
import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default Object.freeze(defineConfig([
    {
        extends: ["js/recommended"],
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {
            "@stylistic": stylistic,
            js
        },
        rules: {
            "@stylistic/array-bracket-spacing": ["error", "never"],
            "@stylistic/arrow-parens": "error",
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/comma-spacing": "error",
            "@stylistic/indent": ["error", 4, {"ignoreComments": true}],
            "@stylistic/key-spacing": ["error"],
            "@stylistic/max-len": ["error", {"code": 80}],
            "@stylistic/no-mixed-spaces-and-tabs": "error",
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/object-curly-spacing": ["error", "never"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
            "no-unused-vars": [
                "error",
                {"caughtErrorsIgnorePattern": "^ignore"}
            ],
            "sort-imports": "error",
            "sort-keys": ["error", "asc"]
        }
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {globals: globals.node}
    }
]));
