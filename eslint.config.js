/*jslint node */
import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import radiant from "@radiantbeing/eslint-config";
import stylistic from "@stylistic/eslint-plugin";

export default Object.freeze(defineConfig([
    {
        extends: [
            "js/recommended",
            radiant.configs.js
        ],
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {js}
    },
    {
        extends: [
            "@stylistic/recommended",
            radiant.configs.stylistic
        ],
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {"@stylistic": stylistic}
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {globals: globals.node}
    }
]));
