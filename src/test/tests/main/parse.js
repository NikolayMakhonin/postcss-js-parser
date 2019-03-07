import {parse} from '../../../main/parse'
import postcssParse from 'postcss/lib/parse'
import postcssStringify from 'postcss/lib/stringify'
import {stringify} from '../../../main/stringify'

describe('main > parse', function () {
	const css = `
		@import 'module.js';
		@font-face {
		
		}
		@media(min-width: 500px) {
		
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
	const js = [
		"@import 'module.js'",
		'@font-face',
		'@media (min-width: 500px)',
		{
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

	it('parse', function () {
		const parsedPostcss = postcssParse(css)

		const parsedJs = parse(parsedPostcss)

		assert.deepStrictEqual(parsedJs, js)
	})

	it('stringify', function () {
		const stringifyPostcss = stringify(js)

		const builder = []
		postcssStringify(stringifyPostcss, o => {
			builder[builder.length] = o
		})
		const stringifyCss = builder.join('')
		
		assert.strictEqual(stringifyCss, css)
	})
})
