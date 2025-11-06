module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  testTimeout: 10000,
  forceExit: true,
  globals: {
    "process.env.NODE_ENV": "test",
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
};
