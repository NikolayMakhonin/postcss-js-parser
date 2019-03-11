"use strict";

var _jsToNodes = require("../../../../../main/helpers/convert/jsToNodes");

/* eslint-disable object-property-newline,array-bracket-newline */
describe('main > helpers > convert > jsToNodes', function () {
  function createNode(name, valueOrNodes, level) {
    if (valueOrNodes == null) {
      return null;
    }

    if (!name) {
      return {
        level,
        comment: valueOrNodes
      };
    }

    if (Array.isArray(valueOrNodes)) {
      return {
        level,
        name,
        nodes: valueOrNodes
      };
    }

    return {
      level,
      name,
      value: valueOrNodes
    };
  }

  function removeParents(node) {
    if (node) {
      if (Array.isArray(node)) {
        for (const child of node) {
          removeParents(child);
        }
      } else {
        if (node.parent) {
          node.parent = true;
        }

        removeParents(node.nodes);
      }
    }

    return node;
  }

  function testJsToNodes(jss, expectedNodes) {
    const nodes = (0, _jsToNodes.jsToNodes)(jss, createNode);
    const errorMessage = `JSS:\r\n${JSON.stringify(jss, null, 4)}\r\n\r\nActual: \r\n${JSON.stringify(removeParents(nodes), null, 4)}\r\n\r\nExpected:\r\n${JSON.stringify(removeParents(expectedNodes), null, 4)}`;
    assert.deepStrictEqual(nodes, expectedNodes, errorMessage);
  }

  it('Property names as inteners', function () {
    testJsToNodes({
      '0': 'value',
      '1': 'value'
    }, [{
      level: 0,
      name: '0',
      value: 'value'
    }, {
      level: 0,
      name: '1',
      value: 'value'
    }]);
    testJsToNodes({
      '1': 'value'
    }, [{
      level: 0,
      name: '1',
      value: 'value'
    }]);
    testJsToNodes({
      [-1]: 'value'
    }, [{
      level: 0,
      name: '-1',
      value: 'value'
    }]);
  });
  it('null', function () {
    testJsToNodes(undefined, undefined);
    testJsToNodes(null, null);
  });
  it('single', function () {
    testJsToNodes({
      prop: undefined
    }, []);
    testJsToNodes({
      prop: null
    }, []);
    testJsToNodes({
      prop: 'value'
    }, [{
      level: 0,
      name: 'prop',
      value: 'value'
    }]);
    testJsToNodes(['comment'], [{
      level: 0,
      comment: 'comment'
    }]);
  });
  it('list', function () {
    testJsToNodes({
      prop: undefined,
      prop2: undefined
    }, []);
    testJsToNodes({
      prop: undefined,
      prop2: 'undefined'
    }, [{
      level: 0,
      name: 'prop2',
      value: 'undefined'
    }]);
    testJsToNodes({
      prop: 'value',
      prop2: 'value2'
    }, [{
      level: 0,
      name: 'prop',
      value: 'value'
    }, {
      level: 0,
      name: 'prop2',
      value: 'value2'
    }]);
    testJsToNodes(['comment', 'comment2', null, undefined], [{
      level: 0,
      comment: 'comment'
    }, {
      level: 0,
      comment: 'comment2'
    }]);
  });
  it('merge', function () {
    testJsToNodes(['comment', [[['comment2']], [[['comment3']]]]], [{
      level: 0,
      comment: 'comment'
    }, {
      level: 0,
      comment: 'comment2'
    }, {
      level: 0,
      comment: 'comment3'
    }]);
  });
  it('mixed', function () {
    testJsToNodes({
      prop: ['comment'],
      prop2: [{
        prop3: 'value3'
      }]
    }, [{
      level: 0,
      name: 'prop',
      nodes: [{
        level: 1,
        comment: 'comment',
        parent: true
      }]
    }, {
      level: 0,
      name: 'prop2',
      nodes: [{
        level: 1,
        name: 'prop3',
        value: 'value3',
        parent: true
      }]
    }]);
  });
  it('complex', function () {
    testJsToNodes({
      prop: [[['comment']]],
      prop1: [[{
        prop2: [[{
          prop3: 'value3'
        }], {
          prop4: 'value4'
        }]
      }]]
    }, [{
      level: 0,
      name: 'prop',
      nodes: [{
        level: 1,
        comment: 'comment',
        parent: true
      }]
    }, {
      level: 0,
      name: 'prop1',
      nodes: [{
        level: 1,
        name: 'prop2',
        nodes: [{
          level: 2,
          name: 'prop3',
          value: 'value3',
          parent: true
        }, {
          level: 2,
          name: 'prop4',
          value: 'value4',
          parent: true
        }],
        parent: true
      }]
    }]);
  });
  it('Detect circular structure', function () {
    const jss = {
      prop1: [{
        prop2: {
          prop3: []
        }
      }]
    };
    jss.prop1[1] = jss.prop1[0].prop2;
    (0, _jsToNodes.jsToNodes)(jss, createNode);
    jss.prop1[1] = jss.prop1[0];
    (0, _jsToNodes.jsToNodes)(jss, createNode);
    jss.prop1[1].prop2.prop3[1] = jss;
    assert.throws(() => (0, _jsToNodes.jsToNodes)(jss, createNode), Error);
  });
});