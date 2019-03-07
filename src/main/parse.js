import {nodesToJs} from './helpers/convert/nodesToJs'
import {parseNode} from './helpers/convert/parseNode'

export function parse(content, options) {
	if (content.type === 'root') {
		content = content.nodes
	} else if (!Array.isArray(content)) {
		content = [content]
	}

	return nodesToJs(content, parseNode)
}

export default parse
