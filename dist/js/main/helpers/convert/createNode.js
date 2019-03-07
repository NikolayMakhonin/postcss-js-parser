"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNode = createNode;
exports.default = void 0;

var _atRule = _interopRequireDefault(require("postcss/lib/at-rule"));

var _rule = _interopRequireDefault(require("postcss/lib/rule"));

var _declaration = _interopRequireDefault(require("postcss/lib/declaration"));

var _comment = _interopRequireDefault(require("postcss/lib/comment"));

/* eslint-disable prefer-template,no-extra-parens */
function createComment(str, level) {
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

function createAtRule(str, level) {
  const match = str.match(/^@([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+([\0-\uFFFF]*?))?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match) {
    return null;
  }

  const result = new _atRule.default();
  result.type = 'atrule';
  result.name = match[1];

  if (match[3]) {
    result.params = match[3];
  }

  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    after: '',
    afterName: ' ',
    between: ' '
  };
  return result;
}

function createRule(name, level) {
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

function createDeclaration(name, value, level) {
  if (value != null) {
    value = value.toString();
  }

  if (!value && value !== '') {
    return null;
  }

  const match = value.match(/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(!important)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);
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

    const comment = createComment(valueOrNodes, level);

    if (comment) {
      return comment;
    }

    const atRule = createAtRule(valueOrNodes, level);

    if (atRule) {
      return atRule;
    }

    throw new Error('You should use one of these syntaxes: "//<comment>" or "@<at-rule> params"');
  } else {
    const atRule = createAtRule(name, level);

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

      const rule = createRule(name, level);
      rule.nodes = valueOrNodes;
      return rule;
    }

    return createDeclaration(name, valueOrNodes, level);
  }
}

var _default = {
  createNode
};
exports.default = _default;