import _regeneratorRuntime from "@babel/runtime/regenerator";
import _typeof from "@babel/runtime/helpers/typeof";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(jsToNodesGenerator);

/* eslint-disable prefer-template,no-extra-parens */
export function addParentToChildNodes(node) {
  if (!node || !node.nodes) {
    return;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = node.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;

      if (!child.parent) {
        child.parent = node;
        addParentToChildNodes(child);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
export function jsToNodes(jsObjectOrArray, createNodeFunc, level, addedObjects) {
  var result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level, addedObjects));

  if (result.length === 1) {
    var value = result[0];

    if (!Array.isArray(value) && (!value || _typeof(value) !== 'object')) {
      addParentToChildNodes(value);
      return value;
    }
  }

  for (var _i = 0; _i < result.length; _i++) {
    var node = result[_i];
    addParentToChildNodes(node);
  }

  return result;
}

function jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level, addedObjects) {
  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, node, nextLevel, name, _node;

  return _regeneratorRuntime.wrap(function jsToNodesGenerator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(jsObjectOrArray == null)) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return jsObjectOrArray;

        case 3:
          return _context.abrupt("return");

        case 4:
          if (!addedObjects) {
            _context.next = 9;
            break;
          }

          if (!addedObjects.has(jsObjectOrArray)) {
            _context.next = 7;
            break;
          }

          throw new Error('Detect circular structure on: ' + jsObjectOrArray);

        case 7:
          _context.next = 10;
          break;

        case 9:
          addedObjects = new Set();

        case 10:
          addedObjects.add(jsObjectOrArray);
          _context.prev = 11;

          if (!level) {
            level = 0;
          }

          if (!Array.isArray(jsObjectOrArray)) {
            _context.next = 48;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 17;
          _iterator2 = jsObjectOrArray[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 33;
            break;
          }

          item = _step2.value;

          if (!(typeof item === 'string')) {
            _context.next = 28;
            break;
          }

          node = createNodeFunc(null, item, level);

          if (!node) {
            _context.next = 26;
            break;
          }

          _context.next = 26;
          return node;

        case 26:
          _context.next = 30;
          break;

        case 28:
          if (!item) {
            _context.next = 30;
            break;
          }

          return _context.delegateYield(jsToNodesGenerator(item, createNodeFunc, level, addedObjects), "t0", 30);

        case 30:
          _iteratorNormalCompletion2 = true;
          _context.next = 19;
          break;

        case 33:
          _context.next = 39;
          break;

        case 35:
          _context.prev = 35;
          _context.t1 = _context["catch"](17);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 39:
          _context.prev = 39;
          _context.prev = 40;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 42:
          _context.prev = 42;

          if (!_didIteratorError2) {
            _context.next = 45;
            break;
          }

          throw _iteratorError2;

        case 45:
          return _context.finish(42);

        case 46:
          return _context.finish(39);

        case 47:
          return _context.abrupt("return");

        case 48:
          if (!(_typeof(jsObjectOrArray) === 'object')) {
            _context.next = 61;
            break;
          }

          nextLevel = level + 1;
          _context.t2 = _regeneratorRuntime.keys(jsObjectOrArray);

        case 51:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 60;
            break;
          }

          name = _context.t3.value;

          if (!Object.prototype.hasOwnProperty.call(jsObjectOrArray, name)) {
            _context.next = 58;
            break;
          }

          _node = createNodeFunc(name, jsToNodes(jsObjectOrArray[name], createNodeFunc, nextLevel, addedObjects), level);

          if (!_node) {
            _context.next = 58;
            break;
          }

          _context.next = 58;
          return _node;

        case 58:
          _context.next = 51;
          break;

        case 60:
          return _context.abrupt("return");

        case 61:
          _context.next = 63;
          return jsObjectOrArray;

        case 63:
          _context.prev = 63;
          addedObjects.delete(jsObjectOrArray);
          return _context.finish(63);

        case 66:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[11,, 63, 66], [17, 35, 39, 47], [40,, 42, 46]]);
}

export default {
  jsToNodes: jsToNodes
};