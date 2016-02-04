React = require 'react'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

Break = React.createClass
	statics:
		consumableElements: ['hr']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: -> {}
		cloneNodeData: (data) -> {}

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) -> {}
		getDataDescriptor: (chunk) -> {}

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) -> [Chunk.create @]

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	render: ->
		React.createElement 'div', { contentEditable:false },
			React.createElement 'hr'


module.exports = Break