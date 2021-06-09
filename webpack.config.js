module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"]
					}
				}
			},
			{
				test: /\.css$/i,
				loader: "css-loader",
				options: {
					modules: true
				}
			}
		]
	}
};
