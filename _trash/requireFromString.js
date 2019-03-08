// see: https://stackoverflow.com/a/19682189/5221762
// see: https://github.com/ariporad/pirates/blob/master/src/index.js
export function requireFromString(src, filename) {
	const m = new module.constructor()
	m.paths = module.paths
	m._compile(src, filename)
	return m.exports
}

export default {
	requireFromString
}
