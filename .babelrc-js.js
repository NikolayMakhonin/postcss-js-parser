module.exports = {
	"ignore": [
		"**/assets/**/*.svelte.js"
	],
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": {
					"node": "8.6.0"
				}
			}
		]
	],
	"plugins": [
		"@babel/plugin-transform-runtime",
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-throw-expressions",

		["@babel/plugin-proposal-class-properties", {"loose": true}],
	]
}
