/* eslint-disable prefer-template,no-extra-parens */
import AtRule from 'postcss/lib/at-rule'
import Rule from 'postcss/lib/rule'
import Declaration from 'postcss/lib/declaration'
import Comment from 'postcss/lib/comment'

function parseComment(str, level) {
	const match = str.match(/^\/[/*](.*)$/s)
	if (!match) {
		return null
	}

	const result = new Comment()
	result.type = 'comment'
	result.text = match[1].trim()
	result.raws = {
		before: '\n'.padEnd(level + 1, '\t'),
		left  : ' ',
		right : ' '
	}
	return result
}

function parseAtRule(str, level) {
	const match = str.match(/^@(\S+)(\s+(.*?))?\s*$/s)
	if (!match) {
		return null
	}

	const result = new AtRule()
	result.type = 'atrule'
	result.name = match[1]
	if (match[3]) {
		result.params = match[3]
	}
	result.raws = {
		before   : '\n'.padEnd(level + 1, '\t'),
		after    : '',
		afterName: ' ',
		between  : ' '
	}

	return result
}

function parseRule(name, level) {
	const result = new Rule()
	result.type = 'rule'
	result.selector = name
	result.raws = {
		before   : '\n'.padEnd(level + 1, '\t'),
		after    : '',
		between  : ' ',
		semicolon: false
	}

	return result
}

function parseDeclaration(name, value, level) {
	if (value != null) {
		value = value.toString().trim()
	}

	if (!value && value !== '') {
		return null
	}

	const match = value.match(/^\s*(.*?)\s*(!important)?\s*$/s)

	const result = new Declaration()
	result.type = 'decl'
	result.prop = name
	result.value = match[1]
	if (match[2]) {
		result.important = true
	}
	result.raws = {
		before : '\n'.padEnd(level + 1, '\t'),
		between: ':',
	}

	return result
}

export function createNode(name, valueOrNodes, level) {
	if (!name) {
		if (!valueOrNodes) {
			return null
		}
		if (typeof valueOrNodes !== 'string') {
			valueOrNodes = valueOrNodes.toString()
		}
		valueOrNodes = valueOrNodes.trim()
		if (!valueOrNodes) {
			return null
		}

		const comment = parseComment(valueOrNodes, level)
		if (comment) {
			return comment
		}

		const atRule = parseAtRule(valueOrNodes, level)
		if (atRule) {
			return atRule
		}

		throw new Error('You should use one of these syntaxes: "//<comment>" or "@<at-rule> params"')
	} else {
		const atRule = parseAtRule(name, level)
		if (atRule) {
			if (valueOrNodes) {
				if (!Array.isArray(valueOrNodes)) {
					throw new Error('@at-rule content must be an array or an object, but was specified: ' + valueOrNodes)
				}
				if (valueOrNodes.length) {
					atRule.nodes = valueOrNodes
				}
			}
			return atRule
		}

		if (Array.isArray(valueOrNodes)) {
			if (!valueOrNodes.length) {
				return null
			}
			const rule = parseRule(name, level)
			rule.nodes = valueOrNodes
			return rule
		}

		return parseDeclaration(name, valueOrNodes, level)
	}
}

export default {
	createNode
}
