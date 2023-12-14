const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    timers: "timers-browserify",
  })
);
