const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                // Tells ESLint that Node variables like 'process' and '__dirname' are safe
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",   // Warns if you declare a variable but never use it
            "no-undef": "error",        // Fails if you use a variable that doesn't exist
            "no-unreachable": "error"   // Fails if you have code after a 'return' statement
        }
    },
    {
        // Tell ESLint that 'jest' variables like 'describe' and 'it' are safe in test files
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: {
                jest: "readonly",
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly"
            }
        }
    }
];