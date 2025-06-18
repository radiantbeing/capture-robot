/*jslint node */
import {defineConfig} from "eslint/config";
import globals from "globals";
import radiant from "@radiantbeing/eslint-config";

export default Object.freeze(defineConfig([
    {
        extends: [radiant.configs.recommended],
        files: ["**/*.{js,mjs,cjs}"]
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {globals: globals.node}
    }
]));
