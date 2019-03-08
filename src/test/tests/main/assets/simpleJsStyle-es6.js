export default [
	"@import 'module.js'",
	'@font-face',
	{
		'@font-face': {
			color: '#0f0'
		},
		'@media (min-width: 500px)': {
			color      : '#0ff',
			'font-size': '1px'
		},
		':global(.x::placeholder)': {
			color     : 'blue !important',
			background: '-moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%)',
			'.y'      : [
				'// Comment',
				{
					content: '"text"'
				}
			]
		}
	}
]
