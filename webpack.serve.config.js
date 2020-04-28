const merge = require('webpack-merge');
const config = require("./webpack.config.js");

module.exports = merge(config, {
	// config.entry = { main: "./src/demo/index.js" };
	// config.output = { filename: "output.js" };
	// config.host = '0.0.0.0';
	mode: "development",
	// stats: 'minimal',
	externals: undefined, // eslint-disable-line
	// devtool not working...
	// config.devtool = "inline-source-map";
	// config.devtool = "cheap-eval-source-map";
});
