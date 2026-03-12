import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";

export default ts.config(
  ts.configs.recommended,
  svelte.configs["flat/recommended"],
  // Svelte 5 runes files use .svelte.ts extension and need the TypeScript parser
  {
    files: ["**/*.svelte.ts"],
    languageOptions: {
      parser: ts.parser,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      // Allow the conventional underscore prefix for intentionally unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Standard SvelteKit navigation (goto(), <a href>) does not require resolve();
      // resolve() is only needed inside onNavigate callbacks for view transitions.
      "svelte/no-navigation-without-resolve": "off",
    },
  },
  {
    ignores: [".svelte-kit/**", "dist/**", "coverage/**"],
  },
);
