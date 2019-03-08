import { postcssToJs } from './helpers/convert/convertPostcssJs';
export function stringify(node, builder) {
  var js = postcssToJs(node);
  builder(JSON.stringify(js, null, 4), node);
}
export default stringify;