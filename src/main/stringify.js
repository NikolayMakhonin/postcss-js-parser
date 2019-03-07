import {jsToNodes} from './helpers/convert/jsToNodes'
import {createNode} from './helpers/convert/createNode'
import Root from 'postcss/lib/root'

export function stringify(content, options) {
	const root = new Root()
	root.nodes = jsToNodes(content, createNode)
	root.raws = {
		after    : '\n',
		semicolon: false
	}

	return root
}

export default stringify
