"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNode = createNode;
exports.jsToNodes = jsToNodes;
exports.jsToPostcss = jsToPostcss;
exports.default = void 0;

var _root = _interopRequireDefault(require("postcss/lib/root"));

var _atRule = _interopRequireDefault(require("postcss/lib/at-rule"));

var _rule = _interopRequireDefault(require("postcss/lib/rule"));

var _declaration = _interopRequireDefault(require("postcss/lib/declaration"));

var _comment = _interopRequireDefault(require("postcss/lib/comment"));

/* eslint-disable prefer-template,no-extra-parens */
function parseComment(str, level) {
  const match = str.match(/^\/[\*\/]([\0-\uFFFF]*)$/);

  if (!match) {
    return null;
  }

  const result = new _comment.default();
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
  const match = str.match(/^@([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match) {
    return null;
  }

  const result = new _atRule.default();
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
  const result = new _rule.default();
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

  const match = value.match(/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(!important)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match[1] && match[1] !== '') {
    return null;
  }

  const result = new _declaration.default();
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

function createNode(name, valueOrNodes, level) {
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

    const comment = parseComment(valueOrNodes, level);

    if (comment) {
      return comment;
    }

    const atRule = parseAtRule(valueOrNodes, level);

    if (atRule) {
      return atRule;
    }

    throw new Error('You should use one of these syntaxes: "//<comment>" or "@<at-rule> params"');
  } else {
    const atRule = parseAtRule(name, level);

    if (atRule) {
      if (valueOrNodes) {
        if (!Array.isArray(valueOrNodes)) {
          throw new Error('@at-rule content must be an array or an object, but was specified: ' + valueOrNodes);
        }

        if (valueOrNodes.length) {
          atRule.nodes = valueOrNodes;
        }
      }

      return atRule;
    }

    if (Array.isArray(valueOrNodes)) {
      if (!valueOrNodes.length) {
        return null;
      }

      const rule = parseRule(name, level);
      rule.nodes = valueOrNodes;
      return rule;
    }

    return parseDeclaration(name, valueOrNodes, level);
  }
}

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

function jsToPostcss(jsObjectOrArray) {
  const root = new _root.default();
  root.raws = {
    after: '\n\t\t',
    semicolon: false // Array.isArray(jsObject)

  };
}

var _default = {
  createNode,
  jsToNodes,
  jsToPostcss
};
exports.default = _default;