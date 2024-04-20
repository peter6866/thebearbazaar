module.exports = {
  extends: ["airbnb", "plugin:node/recommended"],
  rules: {
    "comma-dangle": "off",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-return-await": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next|val" }],
    "import/newline-after-import": "off",
  },
};
