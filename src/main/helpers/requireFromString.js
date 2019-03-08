/* eslint-disable global-require */
// see: https://stackoverflow.com/a/19682189/5221762
// see: https://github.com/ariporad/pirates/blob/master/src/index.js
import {addHook} from 'pirates'
import path from 'path'

export function requireFromString(src, filename) {
	function matcher(requireFileName) {
		return requireFileName === filename
	}

	let revert

	try {
		// see: https://www.npmjs.com/package/pirates
		addHook(
			(code, requireFileName) => code.replace('@@foo', 'console.log(\'foo\');'),
			{
				exts: [path.extname(filename)],
				matcher
			}
		)

		return require(filename)
	} finally {
		revert()
	}
}

export default {
	requireFromString
}
