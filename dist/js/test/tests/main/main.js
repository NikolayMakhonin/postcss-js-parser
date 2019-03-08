"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parse = require("../../../main/parse");

var _postcss = _interopRequireDefault(require("postcss"));

var _parse2 = _interopRequireDefault(require("postcss/lib/parse"));

describe('main > main try to fix travis', function () {
  const postcssInstance = (0, _postcss.default)();
  it('postcss', function () {
    postcssInstance.process();
  });
  it('base', function () {// const node = {
    // 	nodes : [],
    // 	type  : 'root',
    // 	parent: null, // Node
    // 	source: {
    // 		input: {
    // 			css   : 'text',
    // 			hasBOM: false,
    // 			id    : '<input css 1>'
    // 		},
    // 		start: {
    // 			line  : 1,
    // 			column: 1
    // 		},
    // 		end: { // not root
    // 			line  : 1,
    // 			column: 1
    // 		}
    // 	}
    // }
    //
    // const nodes = {
    // 	root: {
    // 		raws: {
    // 			after    : '\n\t\t',
    // 			semicolon: false
    // 		}
    // 	},
    // 	atrule: {
    // 		name  : 'font-face',
    // 		params: '(min-width: 500px)',
    // 		raws  : {
    // 			after    : '\n\t\t',
    // 			afterName: '',
    // 			before   : '\n\t\t',
    // 			between  : ' '
    // 		}
    // 	},
    // 	rule: {
    // 		selector: ':global(.x::placeholder)',
    // 		raws    : {
    // 			after    : '\n\t\t',
    // 			before   : '\n\t\t',
    // 			between  : ' ',
    // 			semicolon: false
    // 		}
    // 	},
    // 	comment: {
    // 		text: 'Comment',
    // 		raws: {
    // 			before: '\n\t\t\t\t',
    // 			left  : ' ',
    // 			right : ' '
    // 		}
    // 	},
    // 	decl: {
    // 		important: true,
    // 		prop     : 'background',
    // 		value    : '-moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)',
    // 		raws     : {
    // 			before : '\n\t\t\t',
    // 			between: ':',
    // 		}
    // 	}
    //
    // 	// warn
    // }
  });
});