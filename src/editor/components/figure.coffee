React = require 'react'

ViewerFigure = require '../../viewer/components/figure'

StyleableText = require '../../text/styleabletext'

# OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin' #@TODO
OboComponentTextStatics = require './statics/obocomponenttextstatics'
OboTextCommandHandlers = require '../commands/obotextcommandhandlers'
OboReact = require '../../oboreact/oboreact'
ComponentMap = require '../../util/componentmap'


Figure = React.createClass
	statics:
		createNodeDataFromDescriptor: ViewerFigure.createNodeDataFromDescriptor

		createNewNodeData: ->
			position: 'center'
			url: ''
			text: new StyleableText()

		createNodeDataFromDescriptor: (descriptor) ->
			position: descriptor.data.position
			url: descriptor.data.url
			text: StyleableText.createFromObject descriptor.data.text

		getDataDescriptor: (oboNode) ->
			text: oboNode.data.text.getExportedObject()
			url: oboNode.data.url
			position: oboNode.data.position

		cloneNodeData: (data) ->
			text: data.text.clone()
			position: data.position
			url: data.url

	getInitialState: ->
		id = @props.oboNode.id
		ComponentMap.registerComponent @, id

		{
			oboNode: @props.oboNode
			editing: false
		}

	componentWillReceiveProps: (nextProps) ->
		@setState { oboNode:nextProps.oboNode }

	handleCommand: (commandEvent, range) ->
		if commandEvent.command is 'deleteText' or commandEvent.command is 'insertText'
			@state.oboNode.remove()
			@setState { oboNode:@state.oboNode }

	# handleCommand: (commandEvent, range) ->
	# 	console.log 'HC', commandEvent, range
	# 	return if commandEvent.command is 'splitText'
	# 	return if commandEvent.command is 'deleteText' and commandEvent.sel.type is 'caret' and range.start is @state.oboNode.data.text.length

	# 	OboTextCommandHandlers.handleCommand @state.oboNode.data.text, commandEvent, range
	# 	@setState { oboNode:@state.oboNode }

	docListener: ->
		console.log 'doc click', arguments
		if @focus
			@focus = false
		else
			document.removeEventListener 'click', @docListener.bind(@)
			@setState { editing:false }

	onClick: ->
		@focus = true

		if not @state.editing
			document.addEventListener 'click', @docListener.bind(@)

		console.log 'onclikeeeee'
		@setState { editing:true }
		console.log @state

	# componentDidUpdate: ->

	render: ->
		# console.log 'fig render', @state.editing
		if @state.editing
			# console.log 'editor'
			child = React.createElement FigureEditor, { oboNode:@state.oboNode, index:@props.index }
		else
			# console.log 'viewer'
			child = React.createElement ViewerFigure, { oboNode:@state.oboNode, index:@props.index }

		return React.createElement 'div', { onClick:@onClick, contentEditable:false }, child



FigureEditor = React.createClass
	getInitialState: ->
		oboNode: @props.oboNode

	setPosition: ->
		positions = ['left', 'center', 'right']
		curIndex = positions.indexOf @state.oboNode.data.position
		curIndex = (curIndex + 1) % positions.length
		@state.oboNode.data.position = positions[curIndex]
		@setState { oboNode:@state.oboNode }
		# @props.saveHistory()

	render: ->
		React.createElement 'div', null,
			React.createElement 'button', { onClick:@setPosition }, 'Set Position'
			OboReact.createElement 'figure', @state.oboNode, @props.index,
				{
					style: { textAlign:@state.oboNode.data.position }
				},
				React.createElement 'img', { src:@state.oboNode.data.url, width:300 },
				React.createElement 'figcaption', { contentEditable:true },
					OboReact.createText(@state.oboNode.data.text, @state.oboNode, 0, null, @props.index)
			# React.createElement ViewerFigure, { oboNode:@state.oboNode, index:@props.index }


module.exports = Figure