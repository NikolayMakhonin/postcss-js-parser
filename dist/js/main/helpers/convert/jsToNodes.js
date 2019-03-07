"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsToNodes = jsToNodes;
exports.default = void 0;

/* eslint-disable prefer-template,no-extra-parens */
function jsToNodes(jsObjectOrArray, createNodeFunc, level) {
  const result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level));

  if (result.length === 1) {
    const value = result[0];

    if (!Array.isArray(value) && (!value || typeof value !== 'object')) {
      return value;
    }
  }

  return result;
}

function* jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level) {
  if (jsObjectOrArray == null) {
    yield jsObjectOrArray;
    return;
  }

  if (!level) {
    level = 0;
  }

  if (Array.isArray(jsObjectOrArray)) {
    for (const item of jsObjectOrArray) {
      if (typeof item === 'string') {
        const node = createNodeFunc(null, item, level);

        if (node) {
          yield node;
        }
      } else if (item) {
        yield* jsToNodesGenerator(item, createNodeFunc, level);
      }
    }

    return;
  }

  if (typeof jsObjectOrArray === 'object') {
    const nextLevel = level + 1;

    for (const name in jsObjectOrArray) {
      if (Object.prototype.hasOwnProperty.call(jsObjectOrArray, name)) {
        const node = createNodeFunc(name, jsToNodes(jsObjectOrArray[name], createNodeFunc, nextLevel), level);

        if (node) {
          yield node;
        }
      }
    }

    return;
  }

  yield jsObjectOrArray;
}

var _default = {
  jsToNodes
};
exports.default = _default;