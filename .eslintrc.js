module.exports = {
  extends: [
    "eslint-config-kentcdodds",
    "eslint-config-kentcdodds/jest",
    "eslint-config-kentcdodds/jsx-a11y",
    "eslint-config-kentcdodds/react",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",

    // meh...
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/prefer-ts-expect-error": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/sort-type-union-intersection-members": "off",
    "jsx-a11y/media-has-caption": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/alt-text": "off", // it's not smart enough...
    "@babel/new-cap": "off",
    "react/jsx-filename-extension": "off",
    "@typescript-eslint/no-namespace": "off",
    "prefer-arrow-callback": "off",
    "no-var": "off",
    "vars-on-top": "off",
    "func-names": "warn",
    "prefer-const": "off",
    "react/self-closing-comp": "off",
    "import/no-mutable-exports": "off",
    "max-depth": "warn",
    "array-callback-return": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-template": "off",
    "jsx-a11y/anchor-is-valid": "off",
    complexity: "warn",

    // I can't figure these out:
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",

    // enable these again someday:
    "@typescript-eslint/no-unsafe-argument": "off",

    // this one isn't smart enough for our "~/" imports
    "import/order": "off",

    // for CatchBoundaries
    "@typescript-eslint/no-throw-literal": "off",
  },
};
