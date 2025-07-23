import globals from "globals";
import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettierConfig from "eslint-config-prettier/flat";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
    globalIgnores(["dist/"]),

    // ESLint의 권장 구성입니다.
    jseslint.configs.recommended,

    // `recommended` 구성의 슈퍼셋이며 버그를 미리 탐지하기 위한 독선적인 권장 구성입니다.
    tseslint.configs.strictTypeChecked,

    // 일관된 코드 서식을 적용하는 추가 구성입니다.
    tseslint.configs.stylisticTypeChecked,

    // 엄격한 타입 검사를 위한 추가 구성입니다. typescript-eslint의 타입 기반 린팅을 보조합니다.
    {
        languageOptions: {
            parserOptions: {
                globals: { ...globals.node },
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },

    // Prettier와 충돌하는 규칙을 끕니다. ESLint 기본 규칙과 typescript-eslint의 규칙에도
    // 영향을 미칩니다.
    eslintPrettierConfig
);
