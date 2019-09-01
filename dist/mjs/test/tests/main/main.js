import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import { parse } from '../../../main/parse';
import postcss from 'postcss';
describe('main > main', function () {
  var postcssInstance = postcss();
  it('postcss', function () {
    postcssInstance.process();
  });
  xit('postcss async require',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var result;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return postcssInstance.process('var color = \'red\'; {x: { color: color }}', {
              parser: parse,
              from: 'file.js',
              requireFromString: function requireFromString() {
                return _asyncToGenerator(
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee() {
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return new Promise(function (resolve) {
                            setTimeout(resolve, 10000);
                          });

                        case 2:
                          return _context.abrupt("return", {
                            x: {
                              color: 'blue'
                            }
                          });

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }))();
              }
            });

          case 2:
            result = _context2.sent;
            console.log(result.css);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
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