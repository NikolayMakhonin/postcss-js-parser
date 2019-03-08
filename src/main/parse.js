import {parseNode} from './helpers/convert/parseNode'
import {jsToPostcss} from './helpers/convert/convertPostcssJs'


export function parse(jsContent, options) {
	// ignore jsContent and use standard load module for support babel and other features and for avoid many errors
	// eslint-disable-next-line global-require
	let jsModule = require(options.from)
	if (jsModule.__esModule === true && typeof jsModule.default !== 'undefined') {
		jsModule = jsModule.default
	}

	return jsToPostcss(jsModule, parseNode)
}

export default parse
