React = require 'react'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

oembed = require '../../net/oembed'
insertHtml = require '../../dom/inserthtml'

tryOEmbed = (url, chunk, callback) ->
	console.log 'tryOEmbed', arguments

	oembed url, (res) ->
		console.log 'oembed', res

		if res.status is 'success'
			chunk.markDirty()

			ref = document.createElement 'div'
			document.body.appendChild ref

			insertHtml chunk, res.result.html, ->
				callback chunk

			return

		chunk.componentContent.html = "<b>Unable to fetch content for #{res.url}: #{res.error.message}</b>"
		chunk.markDirty()
		callback chunk


renderHtml = (chunk, html, callback) ->
	ref = document.createElement 'div'
	document.body.appendChild ref

	insertHtml html, ref, ->
		console.log 'TRY OEMBED RETURN HTML', ref
		html = ref.innerHTML
		chunk.componentContent.html = html
		ref.parentElement.removeChild ref

		callback()



HTML = React.createClass
	statics:
		consumableElements: []

		insertLabel: ['HTML']
		onInsert: (selection, atIndex, opts = {}, updateFn) ->
			newChunk = Chunk.create @

			console.log 'onInsert', opts
			url = if opts.url then opts.url else prompt('URL?')

			if url?.length > 0
				url += '&maxwidth=600'
				tryOEmbed url, newChunk, (chunk) ->
					console.log 'updoot'
					updateFn()
			else
				html = prompt('HTML?')
				renderHtml newChunk, html, ->
					console.log 'html updoot'
					updateFn()


			# selection.setFutureCaret atIndex, { childIndex:0, offset:0 }

			newChunk

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			html: '<span></span>'

		cloneNodeData: (data) ->
			html: data.html

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			html: descriptor.content.html

		getDataDescriptor: (chunk) ->
			html: chunk.componentContent.html

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
		chunk: @props.chunk

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	# componentWillUpdate: (nextProps, nextState) ->
	# 	console.log 'cwu'
	# 	console.log 'cwu'
	# 	console.log 'cwu'
	# 	console.log 'cwu'
	# 	console.log 'cwu', @state.chunk.componentContent.html, nextState.chunk.componentContent.html

	# 	if @state.chunk.componentContent.html isnt nextState.chunk.componentContent.html
	# 		console.log 'diff'

	# componentDidUpdate: ->
	# 	React.findDOMNode(@).innerHTML = ''
	# 	React.findDOMNode(@)

	render: ->
		data = @state.chunk.componentContent

		console.log 'rendar', data.html
		@lastRendered

		React.createElement 'div', { contentEditable:false, dangerouslySetInnerHTML:{__html:data.html}, style:{maxWidth:'100%', overflow:'scroll'} }


module.exports = HTML