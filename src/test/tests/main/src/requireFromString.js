/* eslint-disable global-require,no-sync,prefer-destructuring */
// see: https://stackoverflow.com/a/19682189/5221762
import BuiltinModule from 'module'
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule
import fs from 'fs'

// combine npm 'pirates' and 'require-from-string' for support babel
// see: https://github.com/floatdrop/require-from-string/blob/master/index.js
// see: https://github.com/ariporad/pirates/blob/master/src/index.js
export function requireFromString(code, filename) {
	if (!filename) {
		filename = ''
	}
	if (typeof filename !== 'string') {
		throw new Error(`filename must be a string: ${filename}`)
	}

	let buffer
	function getBuffer() {
		if (!buffer) {
			buffer = Buffer.from(code, 'utf8')
		}
		return buffer
	}

	const now = new Date()
	const nowMs = now.getTime()
	const size = Buffer.byteLength(code, 'utf8')
	const fileStat = {
		size,
		blksize    : 4096,
		blocks     : Math.ceil(size / 4096),
		atimeMs    : nowMs,
		mtimeMs    : nowMs,
		ctimeMs    : nowMs,
		birthtimeMs: nowMs,
		atime      : now,
		mtime      : now,
		ctime      : now,
		birthtime  : now
	}


	const resolveFilename = Module._resolveFilename
	const readFileSync = fs.readFileSync
	const statSync = fs.statSync
	try {
		Module._resolveFilename = () => {
			Module._resolveFilename = resolveFilename
			return filename
		}

		fs.readFileSync = (fname, options, ...other) => {
			if (fname === filename) {
				// fs.readFileSync = readFileSync
				console.log(code)
				return typeof options === 'string'
					? code
					: getBuffer()
			}
			console.log(code)
			return readFileSync.apply(fs, [fname, options, ...other])
		}

		fs.statSync = (fname, ...other) => {
			if (fname === filename) {
				// fs.statSync = statSync
				return fileStat
			}
			return statSync.apply(fs, [fname, ...other])
		}

		return require(filename)
	} finally {
		Module._resolveFilename = resolveFilename
		fs.readFileSync = readFileSync
		fs.statSync = statSync
	}
}

export default {
	requireFromString
}
