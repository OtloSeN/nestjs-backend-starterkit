module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        "@stylistic",
        "import",
        "eslint-plugin-align-import",
        "security",
        "more"
    ],
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [
        '.eslintrc.js',
        './tests/jest.config.js'
    ],
    rules: {
        // General
        "no-useless-escape"              : "error",
        "no-duplicate-imports"           : "error",
        "newline-before-return"          : "error",
        "no-useless-rename"              : "error",
        "object-property-newline"        : [ "error", { "allowMultiplePropertiesPerLine": true } ],
        "no-useless-computed-key"        : "error",
        "no-template-curly-in-string"    : "error",
        "no-unsafe-negation"             : "error",
        "no-global-assign"               : "error",
        "object-curly-newline"           : [ "error", { "consistent": true } ],
        "getter-return"                  : "error",
        "lines-between-class-members"    : [ "error", "always" ],
        "array-callback-return"          : "error",
        "default-param-last"             : "error",
        "no-import-assign"               : "error",
        "array-bracket-newline"          : [ "error", "consistent" ],
        "prefer-exponentiation-operator" : "error",
        "no-dupe-else-if"                : "error",
        "no-constructor-return"          : "error",
        "no-useless-backreference"       : "error",
        "default-case-last"              : "error",
        "no-magic-numbers"               : [ "error", { "ignore": [ -1, 0, 1, 1024, 60, 24, 4, 255, 100 ], "ignoreArrayIndexes": true, "enforceConst": true } ],
        "camelcase"                      : [ "error", { "properties": "always" } ],
        "func-names"                     : [ "error", "always" ],
        "func-style"                     : [ "error", "declaration", { allowArrowFunctions: true } ],
        "max-nested-callbacks"           : [ "error", 4 ],
        "no-array-constructor"           : "error",
        "no-lonely-if"                   : "error",
        "no-nested-ternary"              : "error",
        "no-new-object"                  : "error",
        "no-spaced-func"                 : "error",
        "no-unneeded-ternary"            : "error",
        "one-var"                        : [ "error", "never" ],
        "no-return-await"                : "error",
        "prefer-promise-reject-errors"    : [ "error", { "allowEmptyReject": true } ],
        "no-compare-neg-zero"             : "error",
        "no-buffer-constructor"           : "error",
        "for-direction"                   : "error",
        "comma-dangle"                  : [ "error", "never" ],
        "no-cond-assign"                : [ "error", "always" ],
        "no-constant-condition"         : "error",
        "no-control-regex"              : "error",
        "no-dupe-args"                  : "error",
        "no-dupe-keys"                  : "error",
        "no-duplicate-case"             : "error",
        "no-empty-character-class"      : "error",
        "no-empty"                      : "error",
        "no-ex-assign"                  : "error",
        "no-extra-boolean-cast"         : 0,
        "no-extra-parens"               : [ "error", "functions" ],
        "no-extra-semi"                 : "error",
        "no-func-assign"                : "error",
        "no-inner-declarations"         : "error",
        "no-invalid-regexp"             : "error",
        "no-irregular-whitespace"       : "error",
        "no-negated-in-lhs"             : "error",
        "no-obj-calls"                  : "error",
        "no-regex-spaces"               : "error",
        "no-sparse-arrays"              : "error",
        "no-unreachable"                : "error",
        "use-isnan"                     : "error",
        "valid-typeof"                  : "error",
        "no-unexpected-multiline"       : 0,
        "max-lines-per-function"        : [ "error", { "max": 100, "skipBlankLines": true, "skipComments": true } ],
        "require-atomic-updates"        : "error",
        "no-async-promise-executor"     : "error",
        "no-misleading-character-class" : "error",
        "no-useless-catch"              : "error",
        "block-scoped-var"      : "error",
        "complexity"            : [ "error", 30 ],
        "curly"                 : [ "error", "multi-line" ],
        "default-case"          : "error",
        "dot-notation"          : [ "error", { "allowKeywords": true } ],
        "eqeqeq"                : "error",
        "guard-for-in"          : "error",
        "no-alert"              : 1,
        "no-caller"             : "error",
        "no-case-declarations"  : "error",
        "no-div-regex"          : 0,
        "no-else-return"        : "error",
        "no-eq-null"            : "error",
        "no-eval"               : "error",
        "no-extend-native"      : "error",
        "no-extra-bind"         : "error",
        "no-fallthrough"        : "error",
        "no-floating-decimal"   : "error",
        "no-implied-eval"       : "error",
        "no-iterator"           : "error",
        "no-labels"             : "error",
        "no-lone-blocks"        : "error",
        "no-loop-func"          : "error",
        "no-multi-str"          : "error",
        "no-native-reassign"    : "error",
        "no-new"                : "error",
        "no-new-func"           : "error",
        "no-new-wrappers"       : "error",
        "no-octal"              : "error",
        "no-octal-escape"       : "error",
        "no-param-reassign"     : [ "error", { "props": true } ],
        "no-proto"              : "error",
        "no-redeclare"          : "error",
        "no-script-url"         : "error",
        "no-self-compare"       : "error",
        "no-sequences"          : "error",
        "no-throw-literal"      : "error",
        "no-unused-expressions" : [ "error", { "allowTernary": true } ],
        "no-useless-call"       : "error",
        "no-with"               : "error",
        "radix"                 : "error",
        "wrap-iife"             : [ "error", "outside" ],
        "yoda"                  : "error",
        "arrow-parens"          : 0,
        "arrow-spacing"         : [ "error", { "before": true, "after": true } ],
        "constructor-super"     : "error",
        "no-class-assign"       : "error",
        "no-const-assign"       : "error",
        "no-this-before-super"  : 0,
        "no-var"                : "error",
        "object-shorthand"      : [ "error", "always" ],
        "prefer-arrow-callback" : "error",
        "prefer-const"          : "error",
        "prefer-spread"         : "error",
        "prefer-template"       : "error",
        "no-catch-shadow"              : "error",
        "no-delete-var"                : "error",
        "no-label-var"                 : "error",
        "no-shadow-restricted-names"   : "error",
        "no-shadow"                    : "off",
        "@typescript-eslint/no-shadow" : "error",
        "no-undef-init"                : "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",

        // Stylistic plugin
        "@stylistic/array-bracket-spacing" : [ "error", "always", {
            "singleValue"     : true,
            "objectsInArrays" : true,
            "arraysInArrays"  : true
        } ],
        "@stylistic/brace-style"               : [ "error", "1tbs" ],
        "@stylistic/comma-spacing"             : [ "error", { "before": false, "after": true } ],
        "@stylistic/comma-style"               : [ "error", "last" ],
        "@stylistic/computed-property-spacing" : [ "error", "never" ],
        "@stylistic/eol-last"                  : "error",
        "@stylistic/indent"                    : [ "error", 4, { "SwitchCase": 1, "ignoredNodes": ["PropertyDefinition"] } ],
        "@stylistic/jsx-quotes"                : [ "error", "prefer-single" ],
        "@stylistic/key-spacing"               : [ "error", {
            "singleLine" : {
                "beforeColon" : false,
                "afterColon"  : true
            },
            "multiLine" : {
                "beforeColon" : true,
                "afterColon"  : true,
                "align"       : "colon"
            }
        } ],
        "@stylistic/linebreak-style" : [ "error", "unix" ],
        "@stylistic/max-len"         : [ "error", 120, 4, {
            "ignoreUrls"             : true,
            "ignoreComments"         : false,
            "ignoreTemplateLiterals" : true,
            "ignoreStrings"          : true
        } ],
        "@stylistic/function-paren-newline"         : [ "error", "multiline-arguments" ],
        "@stylistic/new-parens"                  : "error",
        "@stylistic/no-mixed-spaces-and-tabs"    : "error",
        "@stylistic/no-multiple-empty-lines"     : [ "error", { "max": 2, "maxEOF": 1 } ],
        "@stylistic/no-trailing-spaces"          : "error",
        "@stylistic/object-curly-spacing"        : [ "error", "always" ],
        "@stylistic/padded-blocks"               : [ "error", "never" ],
        "@stylistic/quotes"                      : [ 1, "single", "avoid-escape" ],
        "@stylistic/semi-spacing"                : [ "error", { "before": false, "after": true } ],
        "@stylistic/semi"                        : [ "error", "always" ],
        "@stylistic/keyword-spacing"             : "error",
        "@stylistic/space-before-blocks"         : "error",
        "@stylistic/space-before-function-paren" : [ "error", { "anonymous": "always", "named": "never" } ],
        "@stylistic/space-in-parens"             : [ "error", "never" ],
        "@stylistic/space-infix-ops"             : "error",
        "@stylistic/space-unary-ops"             : [ "error", { "words": true, "nonwords": false } ],
        "@stylistic/spaced-comment"              : [ "error", "always", {
            "exceptions" : [ "-", "+" ],
            "markers"    : [ "=", "!" ]
        } ],
        "@stylistic/switch-colon-spacing"            : "error",
        "@stylistic/semi-style"                      : [ "error", "last" ],
        "@stylistic/array-element-newline"           : 0,
        "@stylistic/padding-line-between-statements" : [
            "error",
            { "blankLine": "always", "prev": "block-like", "next": "*" }
        ],

        // Import plugin
        // "import/no-unresolved"              : 2,
        "import/export"                     : 2,
        // "import/no-extraneous-dependencies": [
        //     "error", {
        //        "devDependencies": false, 
        //        "optionalDependencies": false, 
        //        "peerDependencies": false, 
        //        "packageDir": "./"
        //     }
        // ],
        "import/no-mutable-exports"         : 2,
        "import/no-commonjs"                : 2,
        "import/no-duplicates"              : 2,
        "import/imports-first"              : 2,
        "import/order"                      : [ 2, { "groups": [ "builtin", "external", "internal",  "parent", "sibling", "index" ] } ],
        "import/newline-after-import"       : 2,
        "import/no-webpack-loader-syntax"   : 2,
        "import/no-named-default"           : 2,
        // "import/named"                      : 2,

        // Import alignment plugin
        "align-import/align-import" : 1,

        // Security plugin
        "security/detect-unsafe-regex"            : "error",
        "security/detect-buffer-noassert"         : "error",
        "security/detect-child-process"           : "error",
        "security/detect-eval-with-expression"    : "error",
        "security/detect-non-literal-regexp"      : "error",
        "security/detect-possible-timing-attacks" : "error",
        "security/detect-pseudoRandomBytes"       : "error",

        // More plugin
        "more/no-void-map"                      : "error",
        "more/no-c-like-loops"                  : "error",
        "more/prefer-includes"                  : "error",
        "more/no-then"                          : "error",
        "more/no-window"                        : "error",
        "more/no-numeric-endings-for-variables" : "error",
        "more/force-native-methods"             : "error",
        "more/no-duplicated-chains"             : "error",
        "more/classbody-starts-with-newline"    : "off",
        "more/no-filter-instead-of-find"        : "error",
        "more/no-hardcoded-password"            : "error",
        "more/no-hardcoded-configuration-data"  : "error"
    },
  };
  