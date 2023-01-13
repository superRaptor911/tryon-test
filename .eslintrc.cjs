module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.tsx"], // Your TypeScript files extension
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: ["react"],
  rules: {},
};
