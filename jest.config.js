const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: ['**/tests/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};