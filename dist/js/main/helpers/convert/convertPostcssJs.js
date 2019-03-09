"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postcssToJs = postcssToJs;
exports.jsToPostcss = jsToPostcss;
exports.default = void 0;

var _nodesToJs = require("./nodesToJs");

var _parseNode = require("./parseNode");

var _jsToNodes = require("./jsToNodes");

var _createNode = require("./createNode");

var _root = _interopRequireDefault(require("postcss/lib/root"));

function postcssToJs(postcssNodeOrArray) {
  if (postcssNodeOrArray.type === 'root') {
    postcssNodeOrArray = postcssNodeOrArray.nodes;
  } else if (!Array.isArray(postcssNodeOrArray)) {
    postcssNodeOrArray = [postcssNodeOrArray];
  }

  return (0, _nodesToJs.nodesToJs)(postcssNodeOrArray, _parseNode.parseNode);
}

function jsToPostcss(jsArrayOrObject) {
  const root = new _root.default();
  root.nodes = (0, _jsToNodes.jsToNodes)(jsArrayOrObject, _createNode.createNode);
  root.raws = {
    after: '\n',
    semicolon: false
  };
  root.source = (0, _createNode.createSource)(null, root);
  (0, _jsToNodes.addParentToChildNodes)(root);
  return root;
}

var _default = {
  postcssToJs,
  jsToPostcss
};
exports.default = _default;