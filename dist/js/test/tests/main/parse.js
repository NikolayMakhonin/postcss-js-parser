"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _parse = _interopRequireDefault(require("../../../main/parse"));

describe('main > parse', function () {
  it('base', function () {
    (0, _parse.default)('content', {});
  });
});