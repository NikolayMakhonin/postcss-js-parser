"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.default = void 0;

var _parseNode = require("./helpers/convert/parseNode");

var _convertPostcssJs = require("./helpers/convert/convertPostcssJs");

function parse(jsContent, options) {
  // ignore jsContent and use standard load module for support babel and other features and for avoid many errors
  // eslint-disable-next-line global-require
  let jsModule = require(options.from);

  if (jsModule.__esModule === true && typeof jsModule.default !== 'undefined') {
    jsModule = jsModule.default;
  }

  return (0, _convertPostcssJs.jsToPostcss)(jsModule, _parseNode.parseNode);
}

var _default = parse;
exports.default = _default;