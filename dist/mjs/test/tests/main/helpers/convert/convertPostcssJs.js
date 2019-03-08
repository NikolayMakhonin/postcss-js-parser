import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import syntax from '../../../../../main/main';
import postcssParse from 'postcss/lib/parse';
import postcssStringify from 'postcss/lib/stringify';
import { postcssToJs, jsToPostcss } from '../../../../../main/helpers/convert/convertPostcssJs';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import simpleJsStyle from '../../assets/simpleJsStyle';
describe('main > postcssToJs', function () {
  function jsToCss(jsObjectOrArray) {
    var stringifyPostcss = jsToPostcss(jsObjectOrArray);
    var builder = [];
    postcssStringify(stringifyPostcss, function (o) {
      builder[builder.length] = o;
    });
    return builder.join('');
  }

  function cssToJs(css) {
    var parsedPostcss = postcssParse(css);
    return postcssToJs(parsedPostcss);
  }

  function getFileContent(filePath) {
    return new Promise(function (resolve, reject) {
      return fs.readFile(path.resolve(__dirname, filePath), function read(err, data) {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.toString('utf-8'));
      });
    });
  }

  function cssFileToJs(_x) {
    return _cssFileToJs.apply(this, arguments);
  } // async function jsFileToCss(cssFilePath) {
  // 	const css = await new Promise((resolve, reject) => fs.readFile(
  // 		path.resolve(__dirname, cssFilePath),
  // 		function read(err, data) {
  // 			if (err) {
  // 				reject(err)
  // 				return
  // 			}
  //
  // 			resolve(data)
  // 		}
  // 	))
  //
  // 	return cssToJs(css)
  // }


  function _cssFileToJs() {
    _cssFileToJs = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee4(cssFilePath) {
      var css;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getFileContent(cssFilePath);

            case 2:
              css = _context4.sent;
              return _context4.abrupt("return", cssToJs(css));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _cssFileToJs.apply(this, arguments);
  }

  var cssBefore = "\n\t\t@import 'module.js';\n\t\t@font-face;\n\t\t@font-face {\n\t\t\n\t\t}\n\t\t@media(min-width: 500px) {\n\t\t\n\t\t}\n\t\t@font-face {\n\t\t\tcolor: #0f0;\n\t\t}\n\t\t@media(min-width: 500px) {\n\t\t\tcolor: #0ff;\n      \t\tfont-size: 1px\n\t\t}\n\t\t:global(.x::placeholder) {\n\t\t\tcolor: blue !important;\n\t\t\tbackground: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);\n\t\t\t.y {\n\t\t\t\t/* Comment */\n\t\t\t\tcontent: \"text\";\n\t\t\t\t\n\t\t\t}\n\t\t}\n\t\t";
  var jsAfter = ["@import 'module.js'", '@font-face', {
    '@font-face': {
      color: '#0f0'
    },
    '@media (min-width: 500px)': {
      color: '#0ff',
      'font-size': '1px'
    },
    ':global(.x::placeholder)': {
      color: 'blue !important',
      background: '-moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)',
      '.y': ['// Comment', {
        content: '"text"'
      }]
    }
  }];
  var cssAfter = "\n@import 'module.js';\n@font-face;\n@font-face {\n\tcolor: #0f0\n}\n@media (min-width: 500px) {\n\tcolor: #0ff;\n\tfont-size: 1px\n}\n:global(.x::placeholder) {\n\tcolor: blue !important;\n\tbackground: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);\n\t.y {\n\t\t/* Comment */\n\t\tcontent: \"text\"\n\t}\n}\n";
  it('postcssToJs', function () {
    var parsedPostcss = postcssParse(cssBefore);
    var parsedJs = postcssToJs(parsedPostcss);
    assert.deepStrictEqual(parsedJs, jsAfter);
    assert.strictEqual(JSON.stringify(parsedJs), JSON.stringify(jsAfter));
  });
  it('jsToPostcss', function () {
    var stringifyPostcss = jsToPostcss(jsAfter);
    var builder = [];
    postcssStringify(stringifyPostcss, function (o) {
      builder[builder.length] = o;
    });
    var stringifyCss = builder.join('');
    assert.strictEqual(stringifyCss, cssAfter);
  });
  it('facebook css',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var js, css, js2;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return cssFileToJs('../../assets/facebook.css');

          case 2:
            js = _context.sent;
            css = jsToCss(js);
            js2 = cssToJs(css);
            assert.deepStrictEqual(js2, js);
            assert.strictEqual(JSON.stringify(js2, null, 4), JSON.stringify(js, null, 4));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  var postcssInstance = postcss();
  it('postcss syntax',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var filePath, js, result;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePath = path.resolve(__dirname, '../../assets/simpleJsStyle.js');
            _context2.next = 3;
            return getFileContent(filePath);

          case 3:
            js = _context2.sent;
            _context2.next = 6;
            return postcssInstance.process(js, {
              syntax: syntax,
              from: filePath
            });

          case 6:
            result = _context2.sent;
            assert.deepStrictEqual(JSON.parse(result.css), simpleJsStyle);
            assert.strictEqual(result.css, JSON.stringify(simpleJsStyle, null, 4));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('postcss syntax es6',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3() {
    var filePath, js, result;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            filePath = path.resolve(__dirname, '../../assets/simpleJsStyle-es6.js');
            _context3.next = 3;
            return getFileContent(filePath);

          case 3:
            js = _context3.sent;
            _context3.next = 6;
            return postcssInstance.process(js, {
              syntax: syntax,
              from: filePath
            });

          case 6:
            result = _context3.sent;
            assert.deepStrictEqual(JSON.parse(result.css), simpleJsStyle);
            assert.strictEqual(result.css, JSON.stringify(simpleJsStyle, null, 4));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
});