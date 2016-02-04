React = require 'react'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

Break = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) -> {}

	render: ->
		React.createElement 'div', null,
			React.createElement 'hr'


module.exports = Break