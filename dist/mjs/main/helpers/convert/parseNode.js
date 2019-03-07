/* eslint-disable prefer-template,no-extra-parens */
export function parseNode(node) {
  if (!node) {
    return null;
  }

  switch (node.type) {
    case 'root':
      throw new Error('You should not use this function for Root node');

    case 'atrule':
      {
        var _node$name, _node$params;

        var name = ((((_node$name = node.name) === null || _node$name === void 0 ? void 0 : _node$name.trim()) || '') + ' ' + (((_node$params = node.params) === null || _node$params === void 0 ? void 0 : _node$params.trim()) || '')).trim();

        if (name) {
          name = '@' + name;
        } else {
          name = null;
        }

        if (node.nodes && node.nodes.length) {
          return {
            name: name,
            value: node.nodes
          };
        }

        return {
          value: name
        };
      }

    case 'rule':
      {
        var _node$selector;

        return {
          name: ((_node$selector = node.selector) === null || _node$selector === void 0 ? void 0 : _node$selector.trim()) || null,
          value: node.nodes
        };
      }

    case 'comment':
      {
        var _node$text;

        return {
          value: '// ' + (((_node$text = node.text) === null || _node$text === void 0 ? void 0 : _node$text.trim()) || '')
        };
      }

    case 'decl':
      {
        var _node$value, _node$prop;

        var value = (_node$value = node.value) === null || _node$value === void 0 ? void 0 : _node$value.trim();
        return {
          name: ((_node$prop = node.prop) === null || _node$prop === void 0 ? void 0 : _node$prop.trim()) || null,
          value: node.important && value != null ? (value + ' !important').trim() : value
        };
      }

    default:
      return null;
  }
}
export default {
  parseNode: parseNode
};