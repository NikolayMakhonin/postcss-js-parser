/* eslint-disable object-property-newline,array-bracket-newline */
import {jsToNodes} from '../../../../main/helpers/converter'

describe('main > helpers > converter', function () {
	function createNode(name, valueOrNodes) {
		if (typeof valueOrNodes === 'undefined') {
			return null
		}

		if (!name) {
			return {
				comment: valueOrNodes
			}
		}

		if (Array.isArray(valueOrNodes)) {
			return {
				name,
				nodes: valueOrNodes
			}
		}

		return {
			name,
			value: valueOrNodes
		}
	}

	function testJss(jss, postcss) {
		const nodes = jsToNodes(jss, createNode)
		assert.deepStrictEqual(nodes, postcss, `JSS:\r\n${JSON.stringify(jss, null, 4)}\r\n\r\nActual: \r\n${JSON.stringify(nodes, null, 4)}\r\n\r\nExpected:\r\n${JSON.stringify(postcss, null, 4)}`)
	}

	it('null', function () {
		testJss(undefined, undefined)
		testJss(null, null)
	})

	it('single', function () {
		testJss({prop: undefined}, [])
		testJss({prop: null}, [{name: 'prop', value: null}])
		testJss({prop: 'value'}, [{name: 'prop', value: 'value'}])
		testJss(['comment'], [{comment: 'comment'}])
	})

	it('list', function () {
		testJss({prop: undefined, prop2: undefined}, [])
		testJss({prop: undefined, prop2: 'undefined'}, [{name: 'prop2', value: 'undefined'}])
		testJss({prop: 'value', prop2: 'value2'}, [
			{name: 'prop', value: 'value'},
			{name: 'prop2', value: 'value2'}
		])
		testJss(['comment', 'comment2'], [
			{comment: 'comment'},
			{comment: 'comment2'}
		])
	})

	it('merge', function () {
		testJss(['comment', [[['comment2']], [[['comment3']]]]], [
			{comment: 'comment'},
			{comment: 'comment2'},
			{comment: 'comment3'}
		])
	})

	it('mixed', function () {
		testJss({prop: ['comment'], prop2: [{prop3: 'value3'}]}, [
			{
				name : 'prop',
				nodes: [{
					comment: 'comment'
				}]
			},
			{
				name : 'prop2',
				nodes: [{
					name : 'prop3',
					value: 'value3'
				}]
			}])
	})

	it('complex', function () {
		testJss({prop: [[['comment']]], prop1: [[{prop2: [[{prop3: 'value3'}], {prop4: 'value4'}]}]]}, [
			{
				name : 'prop',
				nodes: [
					{
						comment: 'comment'
					}
				]
			},
			{
				name : 'prop1',
				nodes: [
					{
						name : 'prop2',
						nodes: [
							{
								name : 'prop3',
								value: 'value3'
							},
							{
								name : 'prop4',
								value: 'value4'
							}
						]
					}
				]
			}
		])
	})
})
