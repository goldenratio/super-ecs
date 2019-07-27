module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
  },
  "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  "testPathIgnorePatterns": [
    "/dist/",
    "/.rpt2_cache/",
    "/node_modules/"
  ],
  "moduleFileExtensions": [
    "ts",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "collectCoverage": true
};
