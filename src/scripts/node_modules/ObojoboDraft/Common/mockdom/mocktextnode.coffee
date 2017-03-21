class MockTextNode
	constructor: (@text = '') ->
		@nodeType = 'text'
		@parent = null


module.exports = MockTextNode