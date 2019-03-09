/* eslint-disable prefer-template,no-extra-parens */
import AtRule from 'postcss/lib/at-rule';
import Rule from 'postcss/lib/rule';
import Declaration from 'postcss/lib/declaration';
import Comment from 'postcss/lib/comment';

function getSource(name, valueOrNodes) {
  // const obj = name
  // 	? {[name]: valueOrNodes}
  // 	: valueOrNodes
  //
  // const css = obj && typeof obj === 'object'
  // 	? JSON.stringify(obj, null, 4)
  // 	: obj
  return {
    input: {
      // css, // disable for improve performance
      hasBOM: false
    },
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 0
    }
  };
}

function createComment(str, level) {
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

function createAtRule(str, level) {
  var match = str.match(/^@([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+([\0-\uFFFF]*?))?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);

  if (!match) {
    return null;
  }

  var result = new AtRule();
  result.type = 'atrule';
  result.name = match[1];
  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    after: '\n'.padEnd(level + 1, '\t'),
    afterName: '',
    between: ''
  };

  if (match[3]) {
    result.params = match[3];
    result.raws.afterName = ' ';
  }

  return result;
}

function createRule(name, level) {
  var result = new Rule();
  result.type = 'rule';
  result.selector = name;
  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    after: '\n'.padEnd(level + 1, '\t'),
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

  var match = value.match(/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(!important)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);
  var result = new Declaration();
  result.type = 'decl';
  result.prop = name;
  result.value = match[1];

  if (match[2]) {
    result.important = true;
  }

  result.raws = {
    before: '\n'.padEnd(level + 1, '\t'),
    between: ': '
  };
  return result;
}

export function createNode(name, valueOrNodes, level) {
  var node = _createNode(name, valueOrNodes, level);

  if (node) {
    node.source = getSource(name, valueOrNodes);
  }

  return node;
}

function _createNode(name, valueOrNodes, level) {
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

    var comment = createComment(valueOrNodes, level);

    if (comment) {
      return comment;
    }

    var atRule = createAtRule(valueOrNodes, level);

    if (atRule) {
      return atRule;
    }

    throw new Error('You should use one of these syntaxes: "//<comment>" or "@<at-rule> params"');
  } else {
    var _atRule = createAtRule(name, level);

    if (_atRule) {
      if (valueOrNodes) {
        if (!Array.isArray(valueOrNodes)) {
          throw new Error('@at-rule content must be an array or an object, but was specified: ' + valueOrNodes);
        }

        _atRule.nodes = valueOrNodes;
        _atRule.raws.between = ' ';
      }

      return _atRule;
    }

    if (Array.isArray(valueOrNodes)) {
      if (!valueOrNodes.length) {
        return null;
      }

      var rule = createRule(name, level);
      rule.nodes = valueOrNodes;
      return rule;
    }

    return createDeclaration(name, valueOrNodes, level);
  }
}

export default {
  createNode: createNode
};