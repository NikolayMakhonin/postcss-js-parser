import Root from 'postcss/lib/root'
import AtRule from 'postcss/lib/at-rule'
import Rule from 'postcss/lib/rule'
import Declaration from 'postcss/lib/declaration'

function createNode(name, valueOrNodes) {

}

export function jsToNodes(jsObjectOrArray, createNodeFunc) {
	const result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc))
	if (result.length === 1) {
		const value = result[0]
		if (!Array.isArray(value) && (!value || typeof value !== 'object')) {
			return value
		}
	}

	return result
}

export function* jsToNodesGenerator(jsObjectOrArray, createNodeFunc) {
	if (jsObjectOrArray == null) {
		yield jsObjectOrArray
		return
	}


	if (Array.isArray(jsObjectOrArray)) {
		for (const item of jsObjectOrArray) {
			if (typeof item === 'string') {
				const node = createNodeFunc(null, item)
				if (node) {
					yield node
				}
			} else {
				yield* jsToNodesGenerator(item, createNodeFunc)
			}
		}
		return
	}

	if (typeof jsObjectOrArray === 'object') {
		for (const name in jsObjectOrArray) {
			if (Object.prototype.hasOwnProperty.call(jsObjectOrArray, name)) {
				const node = createNodeFunc(name, jsToNodes(jsObjectOrArray[name], createNodeFunc))
				if (node) {
					yield node
				}
			}
		}
		return
	}

	yield jsObjectOrArray
}

export function jsToPostcss(jsObjectOrArray) {
	const root = new Root()
	root.raws = {
		after    : '\n\t\t',
		semicolon: false
	}

	// Array.isArray(jsObject)
}

export default {
	jsToPostcss
}
