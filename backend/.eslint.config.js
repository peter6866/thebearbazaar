module.exports = {
  extends: ["airbnb", "prettier", "plugin:node/recommended"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next|val" }],
  },
};
