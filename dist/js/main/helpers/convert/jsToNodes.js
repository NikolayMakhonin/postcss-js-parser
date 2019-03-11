"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addParentToChildNodes = addParentToChildNodes;
exports.jsToNodes = jsToNodes;
exports.default = void 0;

/* eslint-disable prefer-template,no-extra-parens */
function addParentToChildNodes(node) {
  if (!node || !node.nodes) {
    return;
  }

  for (const child of node.nodes) {
    if (!child.parent) {
      child.parent = node;
      addParentToChildNodes(child);
    }
  }
}

function jsToNodes(jsObjectOrArray, createNodeFunc, level, addedObjects) {
  const result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level, addedObjects));

  if (result.length === 1) {
    const value = result[0];

    if (!Array.isArray(value) && (!value || typeof value !== 'object')) {
      addParentToChildNodes(value);
      return value;
    }
  }

  for (const node of result) {
    addParentToChildNodes(node);
  }

  return result;
}

function* jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level, addedObjects) {
  if (jsObjectOrArray == null) {
    yield jsObjectOrArray;
    return;
  }

  if (addedObjects) {
    if (addedObjects.has(jsObjectOrArray)) {
      throw new Error('Detect circular structure on: ' + jsObjectOrArray);
    }
  } else {
    addedObjects = new Set();
  }

  addedObjects.add(jsObjectOrArray);

  try {
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
          yield* jsToNodesGenerator(item, createNodeFunc, level, addedObjects);
        }
      }

      return;
    }

    if (typeof jsObjectOrArray === 'object') {
      const nextLevel = level + 1;
      let numberPropertyWarn;

      for (const name in jsObjectOrArray) {
        if (Object.prototype.hasOwnProperty.call(jsObjectOrArray, name)) {
          // eslint-disable-next-line eqeqeq
          if (!numberPropertyWarn && Math.floor(name) == name) {
            numberPropertyWarn = true;
            console.warn('Warning: Property name = ' + name + '. It seems that you used spread operator on array inside object: { ...["value1", "value2"] }. Note that JavaScript does not preserve the order of objects properties whose names are integers. You should refrain from using such property names.\r\nYour object: ', jsObjectOrArray);
          }

          const node = createNodeFunc(name, jsToNodes(jsObjectOrArray[name], createNodeFunc, nextLevel, addedObjects), level);

          if (node) {
            yield node;
          }
        }
      }

      return;
    }

    yield jsObjectOrArray;
  } finally {
    addedObjects.delete(jsObjectOrArray);
  }
}

var _default = {
  jsToNodes
};
exports.default = _default;