/*jslint node */
import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default Object.freeze(defineConfig([
    {
        extends: ["js/recommended"],
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {js},
        rules: {
            "curly": ["error", "all"],
            "no-unused-vars": [
                "error",
                {caughtErrorsIgnorePattern: "^ignore"}
            ],
            "sort-imports": "error",
            "sort-keys": ["error", "asc"]
        }
    },
    {
        extends: ["@stylistic/recommended"],
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/block-spacing": "off",
            "@stylistic/brace-style": [
                "error",
                "1tbs",
                {allowSingleLine: true}
            ],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/indent": ["error", 4, {
                ignoreComments: true,
                ignoredNodes: [
                    "ConditionalExpression",
                    "TSUnionType",
                    "TSIntersectionType",
                    "TSTypeParameterInstantiation",
                    "FunctionExpression > .params[decorators.length > 0]",
                    "FunctionExpression > "
                    + ".params > "
                    + ":matches(Decorator, :not(:first-child))"
                ],
                offsetTernaryExpressions: false
            }],
            "@stylistic/max-len": ["error", {
                code: 80,
                comments: 80,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreUrls: true
            }],
            "@stylistic/max-statements-per-line": "off",
            "@stylistic/object-curly-spacing": ["error", "never"],
            "@stylistic/operator-linebreak": ["error", "before"],
            "@stylistic/padded-blocks": "off",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/spaced-comment": "off"
        }
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {globals: globals.node}
    }
]));
