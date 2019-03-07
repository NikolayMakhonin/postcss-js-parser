import _regeneratorRuntime from "@babel/runtime/regenerator";
import _typeof from "@babel/runtime/helpers/typeof";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(jsToNodesGenerator);

/* eslint-disable prefer-template,no-extra-parens */
import Root from 'postcss/lib/root';
import AtRule from 'postcss/lib/at-rule';
import Rule from 'postcss/lib/rule';
import Declaration from 'postcss/lib/declaration';
import Comment from 'postcss/lib/comment';

function parseComment(str, level) {
  var match = str.match(/^\/[\*\/]([\0-\uFFFF]*)$/);

  if (!match) {
    return null;
  }

  var result = new Comment();
  result.type = 'comment';
  result.text = match[1].trim();
  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    left: ' ',
    right: ' '
  };
  return result;
}

function parseAtRule(str, level) {
  var match = str.match(/^@([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match) {
    return null;
  }

  var result = new AtRule();
  result.type = 'atrule';
  result.name = match[1];

  if (match[2]) {
    result.params = match[2];
  }

  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    after: '',
    afterName: ' ',
    between: ' '
  };
  return result;
}

function parseRule(name, level) {
  var result = new Rule();
  result.type = 'rule';
  result.selector = name;
  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    after: '',
    between: ' ',
    semicolon: false
  };
  return result;
}

function parseDeclaration(name, value, level) {
  if (value != null) {
    value = value.toString().trim();
  }

  if (!value && value !== '') {
    return null;
  }

  var match = value.match(/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(!important)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match[1] && match[1] !== '') {
    return null;
  }

  var result = new Declaration();
  result.type = 'decl';
  result.prop = name;
  result.value = match[1];

  if (match[2]) {
    result.important = true;
  }

  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    between: ':'
  };
  return result;
}

export function createNode(name, valueOrNodes, level) {
  if (!name) {
    if (!valueOrNodes) {
      return null;
    }

    if (typeof valueOrNodes !== 'string') {
      valueOrNodes = valueOrNodes.toString();
    }

    valueOrNodes = valueOrNodes.trim();

    if (!valueOrNodes) {
      return null;
    }

    var comment = parseComment(valueOrNodes, level);

    if (comment) {
      return comment;
    }

    var atRule = parseAtRule(valueOrNodes, level);

    if (atRule) {
      return atRule;
    }

    throw new Error('You should use one of these syntaxes: "//<comment>" or "@<at-rule> params"');
  } else {
    var _atRule = parseAtRule(name, level);

    if (_atRule) {
      if (valueOrNodes) {
        if (!Array.isArray(valueOrNodes)) {
          throw new Error('@at-rule content must be an array or an object, but was specified: ' + valueOrNodes);
        }

        if (valueOrNodes.length) {
          _atRule.nodes = valueOrNodes;
        }
      }

      return _atRule;
    }

    if (Array.isArray(valueOrNodes)) {
      if (!valueOrNodes.length) {
        return null;
      }

      var rule = parseRule(name, level);
      rule.nodes = valueOrNodes;
      return rule;
    }

    return parseDeclaration(name, valueOrNodes, level);
  }
}
export function jsToNodes(jsObjectOrArray, createNodeFunc, level) {
  var result = Array.from(jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level));

  if (result.length === 1) {
    var value = result[0];

    if (!Array.isArray(value) && (!value || _typeof(value) !== 'object')) {
      return value;
    }
  }

  return result;
}

function jsToNodesGenerator(jsObjectOrArray, createNodeFunc, level) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, node, nextLevel, name, _node;

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

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 9;
          _iterator = jsObjectOrArray[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 25;
            break;
          }

          item = _step.value;

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
          _iteratorNormalCompletion = true;
          _context.next = 11;
          break;

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t1 = _context["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 31:
          _context.prev = 31;
          _context.prev = 32;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 34:
          _context.prev = 34;

          if (!_didIteratorError) {
            _context.next = 37;
            break;
          }

          throw _iteratorError;

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

export function jsToPostcss(jsObjectOrArray) {
  var root = new Root();
  root.raws = {
    after: '\n\t\t',
    semicolon: false // Array.isArray(jsObject)

  };
}
export default {
  createNode: createNode,
  jsToNodes: jsToNodes,
  jsToPostcss: jsToPostcss
};