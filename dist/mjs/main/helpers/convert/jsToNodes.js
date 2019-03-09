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
export function jsToNodes(jsObjectOrArray, createNodeFunc, level) {
  var result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level));

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

function jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level) {
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
          if (!level) {
            level = 0;
          }

          if (!Array.isArray(jsObjectOrArray)) {
            _context.next = 40;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 9;
          _iterator2 = jsObjectOrArray[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 25;
            break;
          }

          item = _step2.value;

          if (!(typeof item === 'string')) {
            _context.next = 20;
            break;
          }

          node = createNodeFunc(null, item, level);

          if (!node) {
            _context.next = 18;
            break;
          }

          _context.next = 18;
          return node;

        case 18:
          _context.next = 22;
          break;

        case 20:
          if (!item) {
            _context.next = 22;
            break;
          }

          return _context.delegateYield(jsToNodesGenerator(item, createNodeFunc, level), "t0", 22);

        case 22:
          _iteratorNormalCompletion2 = true;
          _context.next = 11;
          break;

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t1 = _context["catch"](9);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 31:
          _context.prev = 31;
          _context.prev = 32;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 34:
          _context.prev = 34;

          if (!_didIteratorError2) {
            _context.next = 37;
            break;
          }

          throw _iteratorError2;

        case 37:
          return _context.finish(34);

        case 38:
          return _context.finish(31);

        case 39:
          return _context.abrupt("return");

        case 40:
          if (!(_typeof(jsObjectOrArray) === 'object')) {
            _context.next = 53;
            break;
          }

          nextLevel = level + 1;
          _context.t2 = _regeneratorRuntime.keys(jsObjectOrArray);

        case 43:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 52;
            break;
          }

          name = _context.t3.value;

          if (!Object.prototype.hasOwnProperty.call(jsObjectOrArray, name)) {
            _context.next = 50;
            break;
          }

          _node = createNodeFunc(name, jsToNodes(jsObjectOrArray[name], createNodeFunc, nextLevel), level);

          if (!_node) {
            _context.next = 50;
            break;
          }

          _context.next = 50;
          return _node;

        case 50:
          _context.next = 43;
          break;

        case 52:
          return _context.abrupt("return");

        case 53:
          _context.next = 55;
          return jsObjectOrArray;

        case 55:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[9, 27, 31, 39], [32,, 34, 38]]);
}

export default {
  jsToNodes: jsToNodes
};