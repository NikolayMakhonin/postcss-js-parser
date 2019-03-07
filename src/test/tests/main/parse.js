import {parse} from '../../../main/parse'
import postcssParse from 'postcss/lib/parse'
import postcssStringify from 'postcss/lib/stringify'
import {stringify} from '../../../main/stringify'
import fs from 'fs'
import path from 'path'

describe('main > parse', function () {
	function jsToCss(jsObjectOrArray) {
		const stringifyPostcss = stringify(jsObjectOrArray)

		const builder = []
		postcssStringify(stringifyPostcss, o => {
			builder[builder.length] = o
		})

		return builder.join('')
	}

	function cssToJs(css) {
		const parsedPostcss = postcssParse(css)
		return parse(parsedPostcss)
	}

	async function cssFileToJs(cssFilePath) {
		const css = await new Promise((resolve, reject) => fs.readFile(
			path.resolve(__dirname, cssFilePath),
			function read(err, data) {
				if (err) {
					reject(err)
					return
				}

				resolve(data)
			}
		))

		return cssToJs(css)
	}

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

	it('parse', function () {
		const parsedPostcss = postcssParse(cssBefore)

		const parsedJs = parse(parsedPostcss)

		assert.deepStrictEqual(parsedJs, jsAfter)
		assert.strictEqual(JSON.stringify(parsedJs), JSON.stringify(jsAfter))
	})

	it('stringify', function () {
		const stringifyPostcss = stringify(jsAfter)

		const builder = []
		postcssStringify(stringifyPostcss, o => {
			builder[builder.length] = o
		})
		const stringifyCss = builder.join('')
		
		assert.strictEqual(stringifyCss, cssAfter)
	})

	it('facebook css', async function () {
		const js = await cssFileToJs('assets/facebook.css')
		const css = jsToCss(js)
		const js2 = cssToJs(css)
		assert.deepStrictEqual(js2, js)
		assert.strictEqual(JSON.stringify(js2, null, 4), JSON.stringify(js, null, 4))
	})
})
