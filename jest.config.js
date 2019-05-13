module.exports = {
  verbose: true,
  "moduleFileExtensions": [
    "js",
    "json",
    "vue"
  ],
  "transform": {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": "babel-jest"
  },
  "collectCoverage": true,
  //"collectCoverageFrom": ["**/*.{js,vue}", "!**/node_modules/**"]
};
