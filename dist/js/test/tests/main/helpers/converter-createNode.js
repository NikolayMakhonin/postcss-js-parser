"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _converter = require("../../../../main/helpers/converter");

var _atRule = _interopRequireDefault(require("postcss/lib/at-rule"));

var _rule = _interopRequireDefault(require("postcss/lib/rule"));

var _declaration = _interopRequireDefault(require("postcss/lib/declaration"));

var _comment = _interopRequireDefault(require("postcss/lib/comment"));

/* eslint-disable object-property-newline,array-bracket-newline */
describe('main > helpers > converter-createNode', function () {
  function testCreateNode(name, valueOrArray, level, expectedNode) {
    const node = (0, _converter.createNode)(name, valueOrArray, level);
    assert.deepStrictEqual(node, expectedNode);
  }

  it('null', function () {
    testCreateNode(undefined, undefined, 0, null);
    testCreateNode(null, null, 0, null);
    testCreateNode(null, undefined, 0, null);
    testCreateNode(undefined, null, 0, null);
    testCreateNode(null, '', 0, null);
    testCreateNode(undefined, '', 0, null); // testCreateNode('prop', undefined, 0, null)
    // testCreateNode('prop', null, 0, null)
  });
  it('comment', function () {
    assert.throws(() => (0, _converter.createNode)(null, '@', 0), Error);
    assert.throws(() => (0, _converter.createNode)(null, '/', 0), Error);
    testCreateNode(null, '// comment text ', 0, Object.assign(new _comment.default(), {
      type: 'comment',
      text: 'comment text',
      raws: {
        before: '\n',
        left: ' ',
        right: ' '
      }
    }));
    testCreateNode(null, '//\r\n\tcomment\r\n\ttext', 3, Object.assign(new _comment.default(), {
      type: 'comment',
      text: 'comment\r\n\ttext',
      raws: {
        before: '\n\t\t\t',
        left: ' ',
        right: ' '
      }
    }));
  });
  it('atrule', function () {
    testCreateNode(null, '@import module\r\n.js ', 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode(null, '@import  module\r\n.js ', 3, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n\t\t\t',
        between: ' '
      }
    }));
    assert.throws(() => (0, _converter.createNode)('@import module\r\n.js ', 'x', 0), Error);
    assert.throws(() => (0, _converter.createNode)('@import module\r\n.js ', {}, 0), Error);
    testCreateNode('@import module\r\n.js ', null, 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode('@import module\r\n.js ', '', 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode('@import module\r\n.js ', [], 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode('@import module\r\n.js ', [(0, _converter.createNode)(null, '//')], 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      },
      nodes: [Object.assign(new _comment.default(), {
        raws: {
          before: '\n',
          left: ' ',
          right: ' '
        },
        text: '',
        type: 'comment'
      })]
    }));
  });
  it('rule', function () {
    testCreateNode('a-b:c .d, .e', undefined, 0, null);
    testCreateNode('a-b:c .d, .e', null, 0, null);
    testCreateNode('a-b:c .d, .e', [], 0, null);
    testCreateNode('a-b:c .d, .e', [(0, _converter.createNode)(null, '//')], 0, Object.assign(new _rule.default(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '',
        before: '\n',
        between: ' ',
        semicolon: false
      },
      nodes: [Object.assign(new _comment.default(), {
        raws: {
          before: '\n',
          left: ' ',
          right: ' '
        },
        text: '',
        type: 'comment'
      })]
    }));
    testCreateNode('a-b:c .d, .e', [(0, _converter.createNode)(null, '//')], 3, Object.assign(new _rule.default(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '',
        before: '\n\t\t\t',
        between: ' ',
        semicolon: false
      },
      nodes: [Object.assign(new _comment.default(), {
        raws: {
          before: '\n',
          left: ' ',
          right: ' '
        },
        text: '',
        type: 'comment'
      })]
    }));
  });
  it('declaration', function () {
    testCreateNode('a-b:c .d, .e', {}, 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '[object Object]',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', '', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r\n\t ', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
  });
});