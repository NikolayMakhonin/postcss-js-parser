/* eslint-disable global-require */
import {parseNode} from './helpers/convert/parseNode'
import {jsToPostcss} from './helpers/convert/convertPostcssJs'

export function parse(jsContent, options) {
	const jsModuleOrPromise = options.requireFromString
		? options.requireFromString(jsContent, options.from)
		: require(options.from)

	return promiseThenSync(
		jsModuleOrPromise,
		jsModule => {
			if (jsModule.__esModule === true && typeof jsModule.default !== 'undefined') {
				return jsModule.default
			}

			return jsModule
		},
		jsModule => jsToPostcss(jsModule, parseNode)
	)
}

function promiseThenSync(promise, ...next) {
	if (promise instanceof Promise) {
		return promise
			.then(o => promiseThenSync(o, ...next))
	}

	if (next.length) {
		promise = next.shift()(promise)
		return promiseThenSync(promise, ...next)
	}

	return promise
}

export default parse
