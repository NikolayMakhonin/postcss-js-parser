/* eslint-disable object-property-newline,array-bracket-newline */
import {parseNode} from '../../../../../main/helpers/convert/parseNode'
import AtRule from 'postcss/lib/at-rule'
import Rule from 'postcss/lib/rule'
import Declaration from 'postcss/lib/declaration'
import Comment from 'postcss/lib/comment'

describe('main > helpers > convert > parseNode', function () {
	function testParseNode(node, expectedItem) {
		const item = parseNode(node, expectedItem)
		assert.deepStrictEqual(item, expectedItem)
		assert.strictEqual(JSON.stringify(item), JSON.stringify(expectedItem))
	}

	it('null', function () {
		testParseNode(undefined, null, null)
		testParseNode(null, null, null)
		testParseNode('', null, null)
		testParseNode({}, null, null)
	})

	it('root', function () {
		assert.throws(() => parseNode({type: 'root'}), Error)
	})

	it('comment', function () {
		testParseNode({type: 'comment'}, {
			value: '// '
		})

		testParseNode({type: 'comment', text: ' \r\n\t comment text \r\n\t'}, {
			value: '// comment text'
		})
	})

	it('atrule', function () {
		testParseNode({type: 'atrule'}, {
			value: null
		})

		testParseNode({type: 'atrule', name: ' \r\n\t import \r\n\t'}, {
			value: '@import'
		})

		testParseNode({
			type  : 'atrule',
			name  : ' \r\n\t import \r\n\t',
			params: ' \n\t module\r\n.js \n\t'
		}, {
			value: '@import module\r\n.js'
		})

		testParseNode({
			type  : 'atrule',
			name  : ' \r\n\t import \r\n\t',
			params: ' \n\t module\r\n.js \n\t',
			nodes : []
		}, {
			name: '@import module\r\n.js',
			value: []
		})

		testParseNode({
			type  : 'atrule',
			name  : ' \r\n\t import \r\n\t',
			params: ' \n\t module\r\n.js \n\t',
			nodes : [{}]
		}, {
			name : '@import module\r\n.js',
			value: [{}]
		})
	})

	it('rule', function () {
		testParseNode({type: 'rule'}, {
			name : null,
			value: undefined
		})

		testParseNode({type: 'rule', selector: ' \r\n\t a-b:c \r\n.d, .e \r\n\t'}, {
			name : 'a-b:c \r\n.d, .e',
			value: undefined
		})

		testParseNode({type: 'rule', selector: ' \r\n\t a-b:c \r\n.d, .e \r\n\t', nodes: []}, {
			name : 'a-b:c \r\n.d, .e',
			value: []
		})
	})

	it('declaration', function () {
		testParseNode({type: 'decl'}, {
			name : null,
			value: undefined
		})

		testParseNode({type: 'decl', prop: ' \r\n\t a-b:c \r\n.d, .e \r\n\t'}, {
			name : 'a-b:c \r\n.d, .e',
			value: undefined
		})

		testParseNode({
			type : 'decl',
			prop : ' \r\n\t a-b:c \r\n.d, .e \r\n\t',
			value: ' \r\n\t val \r\nue \r\n\t'
		}, {
			name : 'a-b:c \r\n.d, .e',
			value: 'val \r\nue'
		})

		testParseNode({
			type     : 'decl',
			prop     : ' \r\n\t a-b:c \r\n.d, .e \r\n\t',
			value    : ' \r\n\t val \r\nue \r\n\t',
			important: true
		}, {
			name : 'a-b:c \r\n.d, .e',
			value: 'val \r\nue !important'
		})
	})
})
