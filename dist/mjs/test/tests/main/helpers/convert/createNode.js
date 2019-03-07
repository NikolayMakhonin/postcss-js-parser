/* eslint-disable object-property-newline,array-bracket-newline */
import { createNode } from '../../../../../main/helpers/convert/createNode';
import AtRule from 'postcss/lib/at-rule';
import Rule from 'postcss/lib/rule';
import Declaration from 'postcss/lib/declaration';
import Comment from 'postcss/lib/comment';
describe('main > helpers > convert > createNode', function () {
  function testCreateNode(name, valueOrNodes, level, expectedNode) {
    var node = createNode(name, valueOrNodes, level);
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
    assert.throws(function () {
      return createNode(null, '@', 0);
    }, Error);
    assert.throws(function () {
      return createNode(null, '/', 0);
    }, Error);
    testCreateNode(null, '// comment text ', 0, Object.assign(new Comment(), {
      type: 'comment',
      text: 'comment text',
      raws: {
        before: '\n',
        left: ' ',
        right: ' '
      }
    }));
    testCreateNode(null, new String('// comment text '), 0, Object.assign(new Comment(), {
      type: 'comment',
      text: 'comment text',
      raws: {
        before: '\n',
        left: ' ',
        right: ' '
      }
    }));
    testCreateNode(null, new String('\r\n\t '), 0, null);
    testCreateNode(null, '//\r\n\tcomment\r\n\ttext', 3, Object.assign(new Comment(), {
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
    testCreateNode(null, '@import \r\n\t ', 0, Object.assign(new AtRule(), {
      type: 'atrule',
      name: 'import',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      }
    }));
    testCreateNode(null, '@import module\r\n.js ', 0, Object.assign(new AtRule(), {
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
    testCreateNode(null, '@import  module\r\n.js ', 3, Object.assign(new AtRule(), {
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
    assert.throws(function () {
      return createNode('@import module\r\n.js ', 'x', 0);
    }, Error);
    assert.throws(function () {
      return createNode('@import module\r\n.js ', {}, 0);
    }, Error);
    testCreateNode('@import module\r\n.js ', null, 0, Object.assign(new AtRule(), {
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
    testCreateNode('@import module\r\n.js ', '', 0, Object.assign(new AtRule(), {
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
    testCreateNode('@import module\r\n.js ', [], 0, Object.assign(new AtRule(), {
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
    testCreateNode('@import module\r\n.js ', [createNode(null, '//')], 0, Object.assign(new AtRule(), {
      type: 'atrule',
      name: 'import',
      params: 'module\r\n.js',
      raws: {
        after: '',
        afterName: ' ',
        before: '\n',
        between: ' '
      },
      nodes: [Object.assign(new Comment(), {
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
    testCreateNode('a-b:c .d, .e', [createNode(null, '//')], 0, Object.assign(new Rule(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '',
        before: '\n',
        between: ' ',
        semicolon: false
      },
      nodes: [Object.assign(new Comment(), {
        raws: {
          before: '\n',
          left: ' ',
          right: ' '
        },
        text: '',
        type: 'comment'
      })]
    }));
    testCreateNode('a-b:c .d, .e', [createNode(null, '//')], 3, Object.assign(new Rule(), {
      type: 'rule',
      selector: 'a-b:c .d, .e',
      raws: {
        after: '',
        before: '\n\t\t\t',
        between: ' ',
        semicolon: false
      },
      nodes: [Object.assign(new Comment(), {
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
    testCreateNode('a-b:c .d, .e', {}, 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '[object Object]',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', '', 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r\n\t ', 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r!important\n\t ', 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '',
      important: true,
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', ' \r! important\n\t ', 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: '! important',
      raws: {
        before: '\n',
        between: ':'
      }
    }));
    testCreateNode('a-b:c .d, .e', '\rx!important\n\t ', 0, Object.assign(new Declaration(), {
      type: 'decl',
      prop: 'a-b:c .d, .e',
      value: 'x',
      important: true,
      raws: {
        before: '\n',
        between: ':'
      }
    }));
  });
});