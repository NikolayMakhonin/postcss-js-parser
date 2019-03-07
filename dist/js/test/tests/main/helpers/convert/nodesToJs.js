"use strict";

var _nodesToJs = require("../../../../../main/helpers/convert/nodesToJs");

/* eslint-disable object-property-newline,array-bracket-newline */
describe('main > helpers > convert > nodesToJs', function () {
  function parseNode(node) {
    if (node == null) {
      return null;
    }

    const result = {};

    if (node._name) {
      result.name = node._name;
    }

    if (node._value) {
      result.value = node._value;
    }

    return result;
  }

  function testNodesToJs(jss, expectedNodes) {
    const nodes = (0, _nodesToJs.nodesToJs)(jss, parseNode);
    assert.deepStrictEqual(nodes, expectedNodes, `JSS:\r\n${JSON.stringify(jss, null, 4)}\r\n\r\nActual: \r\n${JSON.stringify(nodes, null, 4)}\r\n\r\nExpected:\r\n${JSON.stringify(expectedNodes, null, 4)}`);
  }

  it('null', function () {
    testNodesToJs(undefined, null);
    testNodesToJs(null, null);
  });
  it('single', function () {
    testNodesToJs([], null);
    testNodesToJs([{}], null);
    testNodesToJs([{
      _name: 'prop',
      _value: 'val'
    }], {
      prop: 'val'
    });
    testNodesToJs([{
      _value: 'comment'
    }], ['comment']);
  });
  it('list', function () {
    testNodesToJs([{
      _name: 'prop',
      _value: 'value1'
    }, {
      _name: 'prop2',
      _value: 'value2'
    }], {
      prop: 'value1',
      prop2: 'value2'
    });
    testNodesToJs([{
      _value: 'comment'
    }, {
      _value: 'comment2'
    }], ['comment', 'comment2']);
  });
  it('merge', function () {
    testNodesToJs([{
      _value: 'comment'
    }, {
      _value: 'comment2'
    }, {
      _value: 'comment3'
    }], ['comment', 'comment2', 'comment3']);
  });
  it('mixed', function () {
    testNodesToJs([{
      _name: 'prop',
      _value: [{
        _value: 'comment'
      }]
    }, {
      _name: 'prop2',
      _value: [{
        _name: 'prop3',
        _value: 'value3'
      }]
    }], {
      prop: ['comment'],
      prop2: {
        prop3: 'value3'
      }
    });
  });
  it('complex', function () {
    testNodesToJs([{
      _name: 'prop',
      _value: [{
        _value: 'comment'
      }]
    }, {
      _name: 'prop1',
      _value: [{
        _name: 'prop2',
        _value: [{
          _name: 'prop3',
          _value: 'value3'
        }, {
          _name: 'prop4',
          _value: 'value4'
        }]
      }]
    }], {
      prop: ['comment'],
      prop1: {
        prop2: {
          prop3: 'value3',
          prop4: 'value4'
        }
      }
    });
  });
  it('separate', function () {
    testNodesToJs([{
      _name: 'prop1',
      _value: 'value1'
    }, {
      _name: 'prop1',
      _value: null
    }, {
      _name: 'prop2',
      _value: [{
        _value: 'comment'
      }]
    }, {
      _value: 'comment'
    }, {
      _name: 'prop3',
      _value: [{
        _name: 'prop4',
        _value: 'value4'
      }]
    }, {
      _name: 'prop3',
      _value: 'value5'
    }], [{
      prop1: 'value1',
      prop2: ['comment']
    }, 'comment', {
      prop3: {
        prop4: 'value4'
      }
    }, {
      prop3: 'value5'
    }]);
  });
});