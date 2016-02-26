React = require 'react'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

oembed = require '../../net/oembed'

tryOEmbed = (url, chunk, callback) ->
	console.log 'tryOEmbed', arguments

	oembed url, (res) ->
		console.log 'oembed', res

		if res.status is 'success'
			tmp = document.createElement 'div'
			document.body.appendChild tmp
			tmp.innerHTML = res.result.html
			iframe = tmp.children[0]
			url = iframe.getAttribute 'src'
			scrolling = iframe.getAttribute 'src'
			width = iframe.getAttribute 'width'
			height = iframe.getAttribute 'height'
			document.body.removeChild tmp

			console.log 'url be', url, tmp

			if url?.length > 0
				chunk.componentContent.url = url
				if res.thumbnail_url?.length > 0
					chunk.componentContent.thumbnail = res.result.thumbnail_url
				if scrolling?.length > 0
					chunk.componentContent.scrolling = if scrolling.toLowerCase() is 'yes' then true else false
				if width?.length > 0
					chunk.componentContent.width = width
				if height?.length > 0
					chunk.componentContent.height = height

				chunk.markDirty()
				callback chunk
				return

		chunk.componentContent.url = res.params.url
		chunk.markDirty()
		callback chunk


IFrame = React.createClass
	statics:
		consumableElements: []

		insertLabel: ['External Resource']
		onInsert: (selection, atIndex, opts = {}, updateFn) ->
			console.log 'onInsert', opts
			url = if opts.url then opts.url else prompt('URL?')

			newChunk = Chunk.create @

			tryOEmbed url, newChunk, (chunk) ->
				console.log 'updoot'
				updateFn()


			# selection.setFutureCaret atIndex, { childIndex:0, offset:0 }

			newChunk

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			url: null
			thumbnail: null
			scrolling: true
			width: 560
			height: 315

		cloneNodeData: (data) ->
			url: data.url
			thumbnail: data.html
			scrolling: data.scrolling
			width: data.width
			height: data.height

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			url: descriptor.content.url
			thumbnail: descriptor.content.thumbnail
			scrolling: descriptor.content.scrolling
			width: data.width
			height: data.height

		getDataDescriptor: (chunk) ->
			url: chunk.componentContent.url
			thumbnail: chunk.componentContent.thumbnail
			scrolling: chunk.componentContent.scrolling
			width: chunk.componentContent.width
			height: chunk.componentContent.height

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

		console.log 'iframe.render', @, data

		React.createElement 'div', { contentEditable:false, 'data-url':data.url },
			React.createElement 'iframe', { width:data.width, height:data.height, src:data.url, frameborder:0, allowfullscreen:true, scrolling:data.scrolling, style:{ border:'none' } }, null


module.exports = IFrame