module.exports = {
    env           : { browser: true, es2021: true },
    extends       : ["airbnb", "prettier", "plugin:react/jsx-runtime", "plugin:jsx-a11y/recommended", "plugin:react-hooks/recommended", "react-app", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
    settings      : { "import/resolver": { node: { moduleDirectory: ["node_modules", "src/"] } } },
    parser        : ["@typescript-eslint/parser", "@babel/eslint-parser"],
    parserOptions : { ecmaFeatures: { experimentalObjectRestSpread: true, impliedStrict: true }, ecmaVersion: 12, sourceType: "module" },
    plugins       : ["prettier", "react", "react-hooks", "@typescript-eslint", "@babel"],
    rules         : {
        "no-restricted-imports"        : [ "error", { patterns: [ "@mui/*/*/*", "!@mui/material/test-utils/*" ] } ],

        "react/jsx-filename-extension" : 0,
        "no-param-reassign"            : 0,
        "react/prop-types"             : 1,
        "react/require-default-props"  : 0,
        "react/no-array-index-key"     : 0,
        "react/jsx-props-no-spreading" : 0,
        "react/forbid-prop-types"      : 0,
        "import/order"                 : 0,
        "no-console"                   : 0,
        "jsx-a11y/anchor-is-valid"     : 0,
        "prefer-destructuring"         : 0,
        "no-shadow"                    : 0,
        "no-unused-vars"               : [ 1, { "ignoreRestSiblings": false } ],
        "prettier/prettier"            : [ 2, {
                "bracketSpacing" : true,
                "printWidth"     : 180,
                "singleQuote"    : true,
                "trailingComma"  : "none",
                "tabWidth"       : 4,
                "useTabs"        : false,
                "endOfLine"      : "auto"
        } ]
    }
};