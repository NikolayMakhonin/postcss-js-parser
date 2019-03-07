import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";

/* eslint-disable prefer-template,no-extra-parens */
export function nodesToJs(nodes, parseNodeFunc) {
  if (!nodes) {
    return null;
  }

  var result = [];
  var currentObject;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      var _item = parseNodeFunc(node);

      if (_item) {
        var name = _item.name,
            value = _item.value;

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
          currentObject = _defineProperty({}, name, value);
        } else if (currentObject[name]) {
          result[result.length] = currentObject;
          currentObject = _defineProperty({}, name, value);
        } else {
          currentObject[name] = value;
        }
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

  if (currentObject) {
    result[result.length] = currentObject;
  }

  if (!result.length) {
    return null;
  }

  if (result.length === 1) {
    var item = result[0];

    if (item && _typeof(item) === 'object') {
      return item;
    }
  }

  return result;
}
export default {
  nodesToJs: nodesToJs
};