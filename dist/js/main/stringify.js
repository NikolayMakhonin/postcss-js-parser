"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;
exports.default = void 0;

var _convertPostcssJs = require("./helpers/convert/convertPostcssJs");

function stringify(node, builder) {
  const js = (0, _convertPostcssJs.postcssToJs)(node);
  builder(JSON.stringify(js, null, 4), node);
}

var _default = stringify;
exports.default = _default;