"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.default = void 0;

var _parseNode = require("./helpers/convert/parseNode");

var _convertPostcssJs = require("./helpers/convert/convertPostcssJs");

/* eslint-disable global-require */
function parse(jsContent, options) {
  const jsModuleOrPromise = options.requireFromString ? options.requireFromString(jsContent, options.from) : require(options.from);
  return promiseThenSync(jsModuleOrPromise, jsModule => {
    if (jsModule.__esModule === true && typeof jsModule.default !== 'undefined') {
      return jsModule.default;
    }

    return jsModule;
  }, jsModule => (0, _convertPostcssJs.jsToPostcss)(jsModule, _parseNode.parseNode));
}

function promiseThenSync(promise, ...next) {
  if (promise instanceof Promise) {
    return promise.then(o => promiseThenSync(o, ...next));
  }

  if (next.length) {
    promise = next.shift()(promise);
    return promiseThenSync(promise, ...next);
  }

  return promise;
}

var _default = parse;
exports.default = _default;