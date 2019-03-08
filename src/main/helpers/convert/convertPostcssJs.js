import {nodesToJs} from './nodesToJs'
import {parseNode} from './parseNode'
import {jsToNodes} from './jsToNodes'
import {createNode} from './createNode'
import Root from 'postcss/lib/root'

export function postcssToJs(postcssNodeOrArray) {
	if (postcssNodeOrArray.type === 'root') {
		postcssNodeOrArray = postcssNodeOrArray.nodes
	} else if (!Array.isArray(postcssNodeOrArray)) {
		postcssNodeOrArray = [postcssNodeOrArray]
	}

	return nodesToJs(postcssNodeOrArray, parseNode)
}

export function jsToPostcss(jsArrayOrObject) {
	const root = new Root()
	root.nodes = jsToNodes(jsArrayOrObject, createNode)
	root.raws = {
		after    : '\n',
		semicolon: false
	}

	return root
}

export default {
	postcssToJs,
	jsToPostcss
}
