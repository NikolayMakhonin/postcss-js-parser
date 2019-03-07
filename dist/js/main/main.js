"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stringify = _interopRequireDefault(require("./stringify"));

var _parse = _interopRequireDefault(require("./parse"));

var _default = {
  parse: _parse.default,
  stringify: _stringify.default
};
exports.default = _default;