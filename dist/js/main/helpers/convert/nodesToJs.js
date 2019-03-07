"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodesToJs = nodesToJs;
exports.default = void 0;

/* eslint-disable prefer-template,no-extra-parens */
function nodesToJs(nodes, parseNodeFunc) {
  if (!nodes) {
    return null;
  }

  const result = [];
  let currentObject;

  for (const node of nodes) {
    const item = parseNodeFunc(node);

    if (item) {
      let {
        name,
        value
      } = item;

      if (Array.isArray(value)) {
        value = nodesToJs(value, parseNodeFunc);
      } else if (value != null) {
        value = value.trim();
      }

      if (!name) {
        if (value) {
          if (currentObject) {
            result[result.length] = currentObject;
            currentObject = null;
          }

          result[result.length] = value;
        }
      } else if (value == null) {// nothing
      } else if (!currentObject) {
        currentObject = {
          [name]: value
        };
      } else if (currentObject[name]) {
        result[result.length] = currentObject;
        currentObject = {
          [name]: value
        };
      } else {
        currentObject[name] = value;
      }
    }
  }

  if (currentObject) {
    result[result.length] = currentObject;
  }

  if (!result.length) {
    return null;
  }

  if (result.length === 1) {
    const item = result[0];

    if (item && typeof item === 'object') {
      return item;
    }
  }

  return result;
}

var _default = {
  nodesToJs
};
exports.default = _default;