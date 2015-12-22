React = require 'react'

OboNodeComponentMixin = require '../../oboreact/OboNodecomponentmixin'
TextMethods = require './textmethods'
POS = require './textpositionmethods'

Chunk = require '../../models/chunk'

YouTube = React.createClass
	statics:
		consumableElements: []

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			videoId: null

		cloneNodeData: (data) ->
			videoId: data.videoId

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			videoId: descriptor.data.videoId

		getDataDescriptor: (chunk) ->
			videoId: chunk.get('data').videoId

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			console.clear()
			console.log 'yt', el

			data = null

			if el.firstElementChild?.getAttribute?('data-video-id')
				data =
					videoId: el.firstElementChild.getAttribute('data-video-id')

			console.log data
			[Chunk.create @, data]

	getInitialState: ->
		chunk: @props.chunk

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunk: nextProps.chunk
			userVideoId: nextProps.chunk.get('data').videoId
			active: nextProps.isActive
		}

	onClick: ->
		console.log 'YT:onClick'
		if not @state.active
			console.log @props
			@props.activateFn @state.chunk

	onInputChange: (event) ->
		console.log 'change', event
		@setState { userVideoId:event.target.value }

	onSetVideoId: ->
		@state.chunk.markChanged()
		@state.chunk.get('data').videoId = @state.userVideoId
		@setState { chunk:@state.chunk }
		@props.activateFn null

	render: ->
		data = @state.chunk.get('data')

		if @state.active
			childElements =
				React.createElement 'div', null, [
					React.createElement('input', { type:'text', value:@state.userVideoId, onChange:@onInputChange }),
					React.createElement('button', { onClick:@onSetVideoId }, 'Submit!')
				],
				React.createElement 'iframe', { width:560, height:315, src:"https://www.youtube.com/embed/#{data.videoId}", frameBorder:0, allowFullScreen:true }, null
		else
			childElements = React.createElement 'img', { width:'100%', height:'auto', style:{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)'}, src:"https://i.ytimg.com/vi/#{data.videoId}/hqdefault.jpg" }

		React.createElement 'div', { contentEditable:false, 'data-video-id':data.videoId, onClick:@onClick, style: { width:560, height:315, overflow:'hidden', position:'relative' } }, childElements


module.exports = YouTube