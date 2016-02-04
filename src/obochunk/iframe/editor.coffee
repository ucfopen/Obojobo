React = require 'react'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

IFrame = React.createClass
	statics:
		consumableElements: []

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			url: null

		cloneNodeData: (data) ->
			url: data.url

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			url: descriptor.content.url

		getDataDescriptor: (chunk) ->
			url: chunk.componentContent.url

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			console.clear()
			console.log 'yt', el

			data = null

			if el.firstElementChild?.getAttribute?('data-url')
				data =
					url: el.firstElementChild.getAttribute('data-url')

			console.log data
			[Chunk.create @, data]

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	render: ->
		data = @state.chunk.componentContent

		React.createElement 'div', { contentEditable:false, 'data-url':data.url },
			React.createElement 'iframe', { width:560, height:315, src:data.url, frameborder:0, allowfullscreen:true }, null


module.exports = IFrame