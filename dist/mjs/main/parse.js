/* eslint-disable global-require */
import { parseNode } from './helpers/convert/parseNode';
import { jsToPostcss } from './helpers/convert/convertPostcssJs';
export function parse(jsContent, options) {
  var jsModuleOrPromise = options.requireFromString ? options.requireFromString(jsContent, options.from) : require(options.from);
  return promiseThenSync(jsModuleOrPromise, function (jsModule) {
    if (jsModule.__esModule === true && typeof jsModule["default"] !== 'undefined') {
      return jsModule["default"];
    }

    return jsModule;
  }, function (jsModule) {
    return jsToPostcss(jsModule, parseNode);
  });
}

function promiseThenSync(promise) {
  for (var _len = arguments.length, next = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    next[_key - 1] = arguments[_key];
  }

  if (promise instanceof Promise) {
    return promise.then(function (o) {
      return promiseThenSync.apply(void 0, [o].concat(next));
    });
  }

  if (next.length) {
    promise = next.shift()(promise);
    return promiseThenSync.apply(void 0, [promise].concat(next));
  }

  return promise;
}

export default parse;