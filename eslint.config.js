import json from 'eslint-plugin-json';
import eslintPluginYml from 'eslint-plugin-yml';
import eslintPluginToml from 'eslint-plugin-toml';

export default [
  {
    files: ['**/*.json', '**/*.yaml', '**/*.yml', '**/*.toml', 'Dockerfile'],
    "rules": {
      "no-trailing-spaces": "error"
    }
  },
  {
    files: ["**/*.json"],
    ...json.configs["recommended"]
  },
  ...eslintPluginToml.configs['flat/recommended'],
  {
    rules: {
      "no-trailing-spaces": "error"
    }
  },
  ...eslintPluginYml.configs['flat/recommended'],
];
