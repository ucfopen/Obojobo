React = require 'react'

OboNodeComponentMixin = require '../../oboreact/OboNodecomponentmixin'
TextMethods = require './textmethods'
POS = require './textpositionmethods'

Chunk = require '../../models/chunk'

Break = React.createClass
	mixins: [OboNodeComponentMixin]
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

	render: ->
		React.createElement 'div', { contentEditable:false },
			React.createElement 'hr'


module.exports = Break