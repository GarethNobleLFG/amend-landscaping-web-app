const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                // Production globals
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "readonly",
                Buffer: "readonly",

                // Jest test globals
                jest: "readonly",
                describe: "readonly",
                beforeEach: "readonly",
                beforeAll: "readonly",
                afterEach: "readonly", 
                afterAll: "readonly",  
                it: "readonly",
                expect: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        }
    }
];