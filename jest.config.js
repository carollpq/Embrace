module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss|svg|png)$": "<rootDir>/__mocks__/fileMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
};
