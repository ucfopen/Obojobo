React = require 'react'

OboNodeComponentMixin = require '../../oboreact/OboNodecomponentmixin'
TextMethods = require './textmethods'
POS = require './textpositionmethods'

Chunk = require '../../models/chunk'

IFrame = React.createClass
	mixins: [OboNodeComponentMixin]
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
			url: descriptor.data.url

		getDataDescriptor: (chunk) ->
			url: chunk.get('data').url

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

	render: ->
		data = @state.chunk.get('data')

		React.createElement 'div', { contentEditable:false, 'data-url':data.url },
			React.createElement 'iframe', { width:560, height:315, src:data.url, frameborder:0, allowfullscreen:true }, null


module.exports = IFrame