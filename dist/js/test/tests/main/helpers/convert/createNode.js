"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createNode = require("../../../../../main/helpers/convert/createNode");

var _atRule = _interopRequireDefault(require("postcss/lib/at-rule"));

var _rule = _interopRequireDefault(require("postcss/lib/rule"));

var _declaration = _interopRequireDefault(require("postcss/lib/declaration"));

var _comment = _interopRequireDefault(require("postcss/lib/comment"));

/* eslint-disable object-property-newline,array-bracket-newline */
describe('main > helpers > convert > createNode', function () {
  function addSource(node) {
    if (!node) {
      return;
    }

    node.source = {
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

    if (!node.nodes) {
      return;
    }

    for (const child of node.nodes) {
      addSource(child);
    }
  }

  function testCreateNode(name, valueOrNodes, level, expectedNode) {
    addSource(expectedNode);
    const node = (0, _createNode.createNode)(name, valueOrNodes, level);
    assert.deepStrictEqual(node, expectedNode);
  }

  it('null', function () {
    testCreateNode(undefined, undefined, 0, null, null);
    testCreateNode(null, null, 0, null, null);
    testCreateNode(null, undefined, 0, null, null);
    testCreateNode(undefined, null, 0, null, null);
    testCreateNode(null, '', 0, null, null);
    testCreateNode(undefined, '', 0, null, null); // testCreateNode('prop', undefined, 0, null, null)
    // testCreateNode('prop', null, 0, null, null)
  });
  it('comment', function () {
    assert.throws(() => (0, _createNode.createNode)(null, '@', 0), Error);
    assert.throws(() => (0, _createNode.createNode)(null, '/', 0), Error);
    testCreateNode(null, '// comment text ', 0, Object.assign(new _comment.default(), {
      type: 'comment',
      text: 'comment text',
      raws: {
        before: '\n',
        left: ' ',
        right: ' '
      }
    }));
    testCreateNode(null, new String('// comment text '), 0, Object.assign(new _comment.default(), {
      type: 'comment',
      text: 'comment text',
      raws: {
        before: '\n',
        left: ' ',
        right: ' '
      }
    }));
    testCreateNode(null, new String('\r\n\t '), 0, null);
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
    testCreateNode(null, '@import \r\n\t ', 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      raws: {
        after: '\n',
        afterName: '',
        before: '\n',
        between: ''
      }
    }));
    testCreateNode(null, '@import module\r\n.js ', 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '\n',
        afterName: ' ',
        before: '\n',
        between: ''
      }
    }));
    testCreateNode(null, '@import  module\r\n.js ', 3, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '\n\t\t\t',
        afterName: ' ',
        before: '\n\t\t\t',
        between: ''
      }
    }));
    assert.throws(() => (0, _createNode.createNode)('@import module\r\n.js ', 'x', null, 0), Error);
    assert.throws(() => (0, _createNode.createNode)('@import module\r\n.js ', {}, null, 0), Error);
    testCreateNode('@import module\r\n.js ', null, 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '\n',
        afterName: ' ',
        before: '\n',
        between: ''
      }
    }));
    testCreateNode('@import module\r\n.js ', '', 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '\n',
        afterName: ' ',
        before: '\n',
        between: ''
      }
    }));
    testCreateNode('@import module\r\n.js ', [], 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      nodes: [],
      raws: {
        after: '\n',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode('@import module\r\n.js ', [(0, _createNode.createNode)(null, '//')], 0, Object.assign(new _atRule.default(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '\n',
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
    testCreateNode('a-b:c .d, .e', [(0, _createNode.createNode)(null, '//')], 0, Object.assign(new _rule.default(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '\n',
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
    testCreateNode('a-b:c .d, .e', [(0, _createNode.createNode)(null, '//')], 3, Object.assign(new _rule.default(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '\n\t\t\t',
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
        between: ': '
      }
    }));
    testCreateNode('a-b:c .d, .e', '', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ': '
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r\n\t ', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ': '
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r!important\n\t ', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      important: true,
      raws: {
        before: '\n',
        between: ': '
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r! important\n\t ', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '! important',
      raws: {
        before: '\n',
        between: ': '
      }
    }));
    testCreateNode('a-b:c .d, .e', '\rx!important\n\t ', 0, Object.assign(new _declaration.default(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: 'x',
      important: true,
      raws: {
        before: '\n',
        between: ': '
      }
    }));
  });
});