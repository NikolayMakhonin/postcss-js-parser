import syntax from '../../../../../main/main'
import postcssParse from 'postcss/lib/parse'
import postcssStringify from 'postcss/lib/stringify'
import {postcssToJs, jsToPostcss} from '../../../../../main/helpers/convert/convertPostcssJs'
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import simpleJsStyle from '../../assets/simpleJsStyle'
import {requireFromString} from 'require-from-memory'

describe('main > postcssToJs', function () {
	function jsToCss(jsObjectOrArray) {
		const stringifyPostcss = jsToPostcss(jsObjectOrArray)

		const builder = []
		postcssStringify(stringifyPostcss, o => {
			builder[builder.length] = o
		})

		return builder.join('')
	}

	function cssToJs(css) {
		const parsedPostcss = postcssParse(css)
		return postcssToJs(parsedPostcss)
	}

	function getFileContent(filePath) {
		return new Promise((resolve, reject) => fs.readFile(
			path.resolve(__dirname, filePath),
			function read(err, data) {
				if (err) {
					reject(err)
					return
				}

				resolve(data.toString('utf-8'))
			}
		))
	}

	async function cssFileToJs(cssFilePath) {
		const css = await getFileContent(cssFilePath)

		return cssToJs(css)
	}

	// async function jsFileToCss(cssFilePath) {
	// 	const css = await new Promise((resolve, reject) => fs.readFile(
	// 		path.resolve(__dirname, cssFilePath),
	// 		function read(err, data) {
	// 			if (err) {
	// 				reject(err)
	// 				return
	// 			}
	//
	// 			resolve(data)
	// 		}
	// 	))
	//
	// 	return cssToJs(css)
	// }

	const cssBefore = `
		@import 'module.js';
		@font-face;
		@font-face {
		
		}
		@media(min-width: 500px) {
		
		}
		@font-face {
			color: #0f0;
		}
		@media(min-width: 500px) {
			color: #0ff;
      		font-size: 1px
		}
		:global(.x::placeholder) {
			color: blue !important;
			background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);
			.y {
				/* Comment */
				content: "text";
				
			}
		}
		`
	const jsAfter = [
		"@import 'module.js'",
		'@font-face',
		{
			'@font-face': {
				color: '#0f0'
			},
			'@media (min-width: 500px)': {
				color      : '#0ff',
				'font-size': '1px'
			},
			':global(.x::placeholder)': {
				color     : 'blue !important',
				background: '-moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)',
				'.y'      : [
					'// Comment',
					{
						content: '"text"'
					}
				]
			}
		}
	]

	const cssAfter = `
@import 'module.js';
@font-face;
@font-face {
	color: #0f0
}
@media (min-width: 500px) {
	color: #0ff;
	font-size: 1px
}
:global(.x::placeholder) {
	color: blue !important;
	background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);
	.y {
		/* Comment */
		content: "text"
	}
}
`

	it('postcssToJs', function () {
		const parsedPostcss = postcssParse(cssBefore)

		const parsedJs = postcssToJs(parsedPostcss)

		assert.deepStrictEqual(parsedJs, jsAfter)
		assert.strictEqual(JSON.stringify(parsedJs), JSON.stringify(jsAfter))
	})

	it('jsToPostcss', function () {
		const stringifyPostcss = jsToPostcss(jsAfter)

		const builder = []
		postcssStringify(stringifyPostcss, o => {
			builder[builder.length] = o
		})
		const stringifyCss = builder.join('')
		
		assert.strictEqual(stringifyCss, cssAfter)
	})

	it('facebook css', async function () {
		const js = await cssFileToJs('../../assets/facebook.css')
		const css = jsToCss(js)
		const js2 = cssToJs(css)
		assert.deepStrictEqual(js2, js)
		assert.strictEqual(JSON.stringify(js2, null, 4), JSON.stringify(js, null, 4))
	})

	const postcssInstance = postcss()

	it('postcss syntax', async function () {
		const filePath = path.resolve(__dirname, '../../assets/simpleJsStyle.js')
		const js = await getFileContent(filePath)
		const result = await postcssInstance.process(js, {
			syntax,
			from: filePath
		})

		assert.deepStrictEqual(JSON.parse(result.css), simpleJsStyle)
		assert.strictEqual(result.css, JSON.stringify(simpleJsStyle, null, 4))
	})

	it('postcss syntax es6', async function () {
		const filePath = path.resolve(__dirname, '../../assets/simpleJsStyle-es6.js')
		const js = await getFileContent(filePath)
		const result = await postcssInstance.process(js, {
			syntax,
			from: filePath
		})

		assert.deepStrictEqual(JSON.parse(result.css), simpleJsStyle)
		assert.strictEqual(result.css, JSON.stringify(simpleJsStyle, null, 4))
	})

	it('postcss syntax es6 from string', async function () {
		const filePath = path.resolve(__dirname, '../../assets/simpleJsStyle-es6.js')
		const js = await getFileContent(filePath)

		const newFilePath = path.resolve(__dirname, '../../assets/simpleJsStyle-es6-from-string.js')

		const result = await postcssInstance.process(js, {
			syntax,
			from: newFilePath,
			requireFromString
		})

		assert.deepStrictEqual(JSON.parse(result.css), simpleJsStyle)
		assert.strictEqual(result.css, JSON.stringify(simpleJsStyle, null, 4))
	})
})
