"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _main = _interopRequireDefault(require("../../../../../main/main"));

var _parse = _interopRequireDefault(require("postcss/lib/parse"));

var _stringify = _interopRequireDefault(require("postcss/lib/stringify"));

var _convertPostcssJs = require("../../../../../main/helpers/convert/convertPostcssJs");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _postcss = _interopRequireDefault(require("postcss"));

var _simpleJsStyle = _interopRequireDefault(require("../../assets/simpleJsStyle"));

var _requireFromMemory = require("require-from-memory");

describe('main > postcssToJs', function () {
  function jsToCss(jsObjectOrArray) {
    const stringifyPostcss = (0, _convertPostcssJs.jsToPostcss)(jsObjectOrArray);
    const builder = [];
    (0, _stringify.default)(stringifyPostcss, o => {
      builder[builder.length] = o;
    });
    return builder.join('');
  }

  function cssToJs(css) {
    const parsedPostcss = (0, _parse.default)(css);
    return (0, _convertPostcssJs.postcssToJs)(parsedPostcss);
  }

  function getFileContent(filePath) {
    return new Promise((resolve, reject) => _fs.default.readFile(_path.default.resolve(__dirname, filePath), function read(err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data.toString('utf-8'));
    }));
  }

  async function cssFileToJs(cssFilePath) {
    const css = await getFileContent(cssFilePath);
    return cssToJs(css);
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


  const cssBefore = `
		@import 'module.js';
		@font-face;
		@font-face {
		
		}
		@media(min-width: 500px) {
		
		}
		@font-face {
			color: #0f0;
		}
		@media(min-width: 500px) {
			color: #0ff;
      		font-size: 1px
		}
		:global(.x::placeholder) {
			color: blue !important;
			background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);
			.y {
				/* Comment */
				content: "text";
				
			}
		}
		`;
  const jsAfter = ["@import 'module.js'", '@font-face', {
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
  const cssAfter = `
@import 'module.js';
@font-face;
@font-face {
	color: #0f0
}
@media (min-width: 500px) {
	color: #0ff;
	font-size: 1px
}
:global(.x::placeholder) {
	color: blue !important;
	background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);
	.y {
		/* Comment */
		content: "text"
	}
}
`;
  it('postcssToJs', function () {
    const parsedPostcss = (0, _parse.default)(cssBefore);
    const parsedJs = (0, _convertPostcssJs.postcssToJs)(parsedPostcss);
    assert.deepStrictEqual(parsedJs, jsAfter);
    assert.strictEqual(JSON.stringify(parsedJs), JSON.stringify(jsAfter));
  });
  it('jsToPostcss', function () {
    const stringifyPostcss = (0, _convertPostcssJs.jsToPostcss)(jsAfter);
    const builder = [];
    (0, _stringify.default)(stringifyPostcss, o => {
      builder[builder.length] = o;
    });
    const stringifyCss = builder.join('');
    assert.strictEqual(stringifyCss, cssAfter);
  });
  it('facebook css', async function () {
    const js = await cssFileToJs('../../assets/facebook.css');
    const css = jsToCss(js);
    const js2 = cssToJs(css);
    assert.deepStrictEqual(js2, js);
    assert.strictEqual(JSON.stringify(js2, null, 4), JSON.stringify(js, null, 4));
  });
  const postcssInstance = (0, _postcss.default)();
  it('postcss syntax', async function () {
    const filePath = _path.default.resolve(__dirname, '../../assets/simpleJsStyle.js');

    const js = await getFileContent(filePath);
    const result = await postcssInstance.process(js, {
      syntax: _main.default,
      from: filePath
    });
    assert.deepStrictEqual(JSON.parse(result.css), _simpleJsStyle.default);
    assert.strictEqual(result.css, JSON.stringify(_simpleJsStyle.default, null, 4));
  });
  it('postcss syntax es6', async function () {
    const filePath = _path.default.resolve(__dirname, '../../assets/simpleJsStyle-es6.js');

    const js = await getFileContent(filePath);
    const result = await postcssInstance.process(js, {
      syntax: _main.default,
      from: filePath
    });
    assert.deepStrictEqual(JSON.parse(result.css), _simpleJsStyle.default);
    assert.strictEqual(result.css, JSON.stringify(_simpleJsStyle.default, null, 4));
  });
  it('postcss syntax es6 from string', async function () {
    const filePath = _path.default.resolve(__dirname, '../../assets/simpleJsStyle-es6.js');

    const js = await getFileContent(filePath);

    const newFilePath = _path.default.resolve(__dirname, '../../assets/simpleJsStyle-es6-from-string.js');

    const result = await postcssInstance.process(js, {
      syntax: _main.default,
      from: newFilePath,
      requireFromString: _requireFromMemory.requireFromString
    });
    assert.deepStrictEqual(JSON.parse(result.css), _simpleJsStyle.default);
    assert.strictEqual(result.css, JSON.stringify(_simpleJsStyle.default, null, 4));
  });
});