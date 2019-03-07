"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parseNode = require("../../../../../main/helpers/convert/parseNode");

var _atRule = _interopRequireDefault(require("postcss/lib/at-rule"));

var _rule = _interopRequireDefault(require("postcss/lib/rule"));

var _declaration = _interopRequireDefault(require("postcss/lib/declaration"));

var _comment = _interopRequireDefault(require("postcss/lib/comment"));

/* eslint-disable object-property-newline,array-bracket-newline */
describe('main > helpers > convert > parseNode', function () {
  function testParseNode(node, expectedItem) {
    const item = (0, _parseNode.parseNode)(node, expectedItem);
    assert.deepStrictEqual(item, expectedItem);
  }

  it('null', function () {
    testParseNode(undefined, null, null);
    testParseNode(null, null, null);
    testParseNode('', null, null);
    testParseNode({}, null, null);
  });
  it('root', function () {
    assert.throws(() => (0, _parseNode.parseNode)({
      type: 'root'
    }), Error);
  });
  it('comment', function () {
    testParseNode({
      type: 'comment'
    }, {
      value: '// '
    });
    testParseNode({
      type: 'comment',
      text: ' \r\n\t comment text \r\n\t'
    }, {
      value: '// comment text'
    });
  });
  it('atrule', function () {
    testParseNode({
      type: 'atrule'
    }, {
      value: null
    });
    testParseNode({
      type: 'atrule',
      name: ' \r\n\t import \r\n\t'
    }, {
      value: '@import'
    });
    testParseNode({
      type: 'atrule',
      name: ' \r\n\t import \r\n\t',
      params: ' \n\t module\r\n.js \n\t'
    }, {
      value: '@import module\r\n.js'
    });
    testParseNode({
      type: 'atrule',
      name: ' \r\n\t import \r\n\t',
      params: ' \n\t module\r\n.js \n\t',
      nodes: []
    }, {
      value: '@import module\r\n.js'
    });
    testParseNode({
      type: 'atrule',
      name: ' \r\n\t import \r\n\t',
      params: ' \n\t module\r\n.js \n\t',
      nodes: [{}]
    }, {
      name: '@import module\r\n.js',
      value: [{}]
    });
  });
  it('rule', function () {
    testParseNode({
      type: 'rule'
    }, {
      name: null,
      value: undefined
    });
    testParseNode({
      type: 'rule',
      selector: ' \r\n\t a-b:c \r\n.d, .e \r\n\t'
    }, {
      name: 'a-b:c \r\n.d, .e',
      value: undefined
    });
    testParseNode({
      type: 'rule',
      selector: ' \r\n\t a-b:c \r\n.d, .e \r\n\t',
      nodes: []
    }, {
      name: 'a-b:c \r\n.d, .e',
      value: []
    });
  });
  it('declaration', function () {
    testParseNode({
      type: 'decl'
    }, {
      name: null,
      value: undefined
    });
    testParseNode({
      type: 'decl',
      prop: ' \r\n\t a-b:c \r\n.d, .e \r\n\t'
    }, {
      name: 'a-b:c \r\n.d, .e',
      value: undefined
    });
    testParseNode({
      type: 'decl',
      prop: ' \r\n\t a-b:c \r\n.d, .e \r\n\t',
      value: ' \r\n\t val \r\nue \r\n\t'
    }, {
      name: 'a-b:c \r\n.d, .e',
      value: 'val \r\nue'
    });
    testParseNode({
      type: 'decl',
      prop: ' \r\n\t a-b:c \r\n.d, .e \r\n\t',
      value: ' \r\n\t val \r\nue \r\n\t',
      important: true
    }, {
      name: 'a-b:c \r\n.d, .e',
      value: 'val \r\nue !important'
    });
  });
});