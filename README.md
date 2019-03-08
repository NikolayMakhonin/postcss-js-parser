<!-- Markdown Docs: -->
<!-- https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown -->
<!-- https://daringfireball.net/projects/markdown/basics -->
<!-- https://daringfireball.net/projects/markdown/syntax -->

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Rationale

It turned out that no one CSS preprocessor is able to provide modularity of styles at the development level. 

The convenience of preprocessors in the details is completely leveled when the application grows, because the preprocessors cannot provide adequate modularity.

When I have such a powerful tool at hand as JavaScript - it would not be wise not to use it.

Styles written in JavaScript are not so convenient, but when extending even a small project, the power of the JavaScript language fully compensated for this drawback.

# Description

You can use your JS modules for compile CSS files.

One possible use case:
```
import postcss from 'postcss'
import jsSyntax from 'postcss-js-syntax'

const css = postcss([...your plugins])
    .process(
        '', // this parameter will be ignored by js parser
        {
            from: require.resolve('./myJsStyle.js'), // required absolute path to real file
            parser: jsSyntax.parser,
            requireFromString: function(code, filename) {
            	// you can provide your own requireFromString function
            	
            	// default:
            	return require(filename)
            }
        }

console.log(css)
```

I recommend to use `require-from-memory` npm module

CSS styles in JavaScript format represent an simple object:

`my-style.js`
```
module.exports = [
    "@at-rule-wiwhout-params", // starts with @
    "@at-rule with params",
    "@at-rule (with params)",
    "// comment", // starts with "//" or "/*"
    {
        ".selector1": {
            color: "#0f0"
        },
        ".selector2": {
            color: "#0f0"
        }
    },
    "// another comment",
    {
        "@at-rule (with params)": {
            "and-content": "value"
        },
        ".selector3": {
            color: "#0f0",
            
            ".sub-selector": { // for your other preprocessors
                content: '"quots is required for this CSS property"'
            }
        }
    }
]
```

You can also use ES6 modules with babel, because JS styles connect as usual modules with the `require` method in the same context in which PostCSS was launched:
```
export default [
    ... your JS style
]
``` 

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/postcss-js-syntax.svg
[npm-url]: https://npmjs.org/package/postcss-js-syntax
[node-version-image]: https://img.shields.io/node/v/postcss-js-syntax.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/postcss-js-syntax.svg
[travis-url]: https://travis-ci.org/NikolayMakhonin/postcss-js-syntax
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/postcss-js-syntax/badge.svg
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/postcss-js-syntax
[downloads-image]: https://img.shields.io/npm/dm/postcss-js-syntax.svg
[downloads-url]: https://npmjs.org/package/postcss-js-syntax
[npm-url]: https://npmjs.org/package/postcss-js-syntax
