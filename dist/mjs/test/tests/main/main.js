import main from '../../../main/main';
import postcss from 'postcss';
import postcssParse from 'postcss/lib/parse';
describe('main > main', function () {
  it('postcssParse', function () {
    var css = "\n\t\t@import 'module.js';\n\t\t@font-face {\n\t\t\n\t\t}\n\t\t@media(min-width: 500px) {\n\t\t\n\t\t}\n\t\t:global(.x::placeholder) {\n\t\t\tcolor: blue !important;\n\t\t\tbackground: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);\n\t\t\t.y {\n\t\t\t\t/* Comment */\n\t\t\t\tcontent: \"text\";\n\t\t\t\t\n\t\t\t}\n\t\t}\n\t\t";
    var parsed = postcssParse(css);
    console.log(JSON.stringify(parsed, null, 4));
  });
  it('base', function () {
    var node = {
      nodes: [],
      type: 'root',
      parent: null,
      // Node
      source: {
        input: {
          css: 'text',
          hasBOM: false,
          id: '<input css 1>'
        },
        start: {
          line: 1,
          column: 1
        },
        end: {
          // not root
          line: 1,
          column: 1
        }
      }
    };
    var nodes = {
      root: {
        raws: {
          after: '\n\t\t',
          semicolon: false
        }
      },
      atrule: {
        name: 'font-face',
        params: '(min-width: 500px)',
        raws: {
          after: '\n\t\t',
          afterName: '',
          before: '\n\t\t',
          between: ' '
        }
      },
      rule: {
        selector: ':global(.x::placeholder)',
        raws: {
          after: '\n\t\t',
          before: '\n\t\t',
          between: ' ',
          semicolon: false
        }
      },
      comment: {
        text: 'Comment',
        raws: {
          before: '\n\t\t\t\t',
          left: ' ',
          right: ' '
        }
      },
      decl: {
        important: true,
        prop: 'background',
        value: '-moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)',
        raws: {
          before: '\n\t\t\t',
          between: ':'
        } // warn

      }
    };
  });
});