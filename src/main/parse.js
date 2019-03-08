/* eslint-disable global-require */
import {parseNode} from './helpers/convert/parseNode'
import {jsToPostcss} from './helpers/convert/convertPostcssJs'

export function parse(jsContent, options) {
	// eslint-disable-next-line global-require
	let jsModule = options.requireFromString
		? options.requireFromString(jsContent, options.from)
		: require(options.from)

	if (jsModule.__esModule === true && typeof jsModule.default !== 'undefined') {
		jsModule = jsModule.default
	}

	return jsToPostcss(jsModule, parseNode)
}

export default parse
