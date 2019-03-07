/* eslint-disable prefer-template,no-extra-parens */

export function parseNode(node) {
	if (!node) {
		return null
	}

	switch (node.type) {
		case 'root':
			throw new Error('You should not use this function for Root node')
		case 'atrule': {
			let name = (
				(node.name?.trim() || '')
				+ ' '
				+ (node.params?.trim() || '')
			).trim()

			if (name) {
				name = '@' + name
			} else {
				name = null
			}
			
			if (node.nodes) {
				return {
					name,
					value: node.nodes
				}
			}
			
			return {
				value: name
			}
		}
		case 'rule': {
			return {
				name : node.selector?.trim() || null,
				value: node.nodes
			}
		}
		case 'comment': {
			return {
				value: '// ' + (node.text?.trim() || '')
			}
		}
		case 'decl': {
			const value = node.value?.trim()
			return {
				name : node.prop?.trim() || null,
				value: node.important && value != null ? (value + ' !important').trim() : value
			}
		}
		default:
			return null
	}
}

export default {
	parseNode
}
