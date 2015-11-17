React = require 'react'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
StyleType = require '../../text/styletype'

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
OboSelectionDOMUtil = require '../../obodom/selection/oboselectiondomutil'

Test = React.createClass
	getInitialState: ->
		styleableText: new StyleableText("Hello")

	onKeyDown: (event) ->
		# console.log 'keydown', event.repeat
		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			when Keyboard.BACKSPACE
				event.preventDefault()
				@send Command.DELETE_TEXT, [Command.DELETE_BACKWARD]

			when Keyboard.DELETE
				event.preventDefault()
				@send Command.DELETE_TEXT, [Command.DELETE_FORWARD]

			when Keyboard.TAB
				event.preventDefault()
				@send Command.INSERT_TAB, [event.shiftKey]

			when Keyboard.ENTER
				event.preventDefault()
				@send Command.SPLIT_TEXT

			# We want to capture ctrl/cmd+b and other such events
			# to stop the browsers default execCommand behavior.
			when 66 #b
				if metaOrCtrlKeyHeld
					event.preventDefault()
					if window.getSelection().type is 'Range'
						@send Command.TOGGLE_STYLE_TEXT, [StyleType.BOLD]
					else
						@send Command.SET_STYLE, [StyleType.BOLD]

			when 73 #i
				if metaOrCtrlKeyHeld
					event.preventDefault()
					if window.getSelection().type is 'Range'
						@send Command.TOGGLE_STYLE_TEXT, [StyleType.ITALIC]
					else
						@send Command.SET_STYLE, [StyleType.ITALIC]

			when 65 #a
				if metaOrCtrlKeyHeld
					event.preventDefault()
					@send Command.SELECT_ALL

	onKeyPress: (event) ->
		console.time 'kp'

		event.preventDefault()

		char = String.fromCharCode event.charCode

		@send Command.INSERT_TEXT, [char]

	getSelection: ->
		range = window.getSelection().getRangeAt 0

		startNode = OboSelectionDOMUtil.findTextWithId(range.startContainer)
		endNode   = OboSelectionDOMUtil.findTextWithId(range.endContainer)

		startTextIndex = Text.getOboTextPos range.startContainer, range.startOffset, startNode
		endTextIndex = Text.getOboTextPos range.endContainer, range.endOffset, endNode

		start:
			node: startNode
			index: Math.min startTextIndex, endTextIndex
		end:
			node: endNode
			index: Math.max startTextIndex, endTextIndex
		length: Math.abs(endTextIndex - startTextIndex)



	send: (command, data = []) ->
		@sel = @getSelection()

		console.log 'sel be', @sel

		switch command
			when 'insertText'
				if @sel.length > 1
					@state.styleableText.deleteText @sel.start.index, @sel.end.index

				@state.styleableText.insertText @sel.start.index, data[0]
				@sel.start.index = @sel.end.index = @sel.start.index + 1

			when Command.TOGGLE_STYLE_TEXT
				console.log 'style text', @sel, data
				@state.styleableText.styleText @sel.start.index, @sel.end.index, data[0]

		@setState { styleableText:@state.styleableText }


	componentDidUpdate: ->
		if @sel
			@select @sel

	select: (sel) ->
		startDomPos = Text.getDomPosition sel.start.index, sel.start.node
		endDomPos   = Text.getDomPosition sel.end.index,   sel.end.node

		s = window.getSelection()
		r = new Range

		r.setStart startDomPos.textNode, startDomPos.offset
		r.setEnd endDomPos.textNode, endDomPos.offset

		s.removeAllRanges()
		s.addRange r



		# startComponent = @sel.start.path.last.component
		# endComponent   = @sel.end.path.last.component

		# return if not startComponent or not endComponent

		# #prime the pumps
		# if @history.length is 0
		# 	@history.add @loDescriptor, @sel.toDescriptor()

		# commandEvent = new CommandEvent command, @sel, data
		# @selectionPending = @sel

		# if @sel.type isnt 'nodeRange'
		# 	callTree @sel.start.path.all, commandEvent, new OboSelectionRange('only', @sel.start.textIndex, @sel.end.textIndex, @sel.start.oboNode)
		# else
		# 	callTree @sel.start.path.all, commandEvent, new OboSelectionRange('start', @sel.start.textIndex, Infinity, @sel.start.oboNode)

		# 	nodePath = @sel.path
		# 	for oboNode in nodePath.slice(1, -1)
		# 		component = ComponentMap.getComponentById oboNode.id
		# 		if component?
		# 			component.handleCommand commandEvent, new OboSelectionRange('inside', 0, Infinity, oboNode)

		# 	callTree @sel.end.path.all, commandEvent, new OboSelectionRange('end', 0, @sel.end.textIndex, @sel.end.oboNode)

		# console.time 'toDescriptor'
		# @loDescriptor = @state.root.toDescriptor true
		# console.timeEnd 'toDescriptor'

		# @onChildUpdate commandEvent

	render: ->
		console.log @state
		React.createElement 'div', { contentEditable:true, onKeyDown:@onKeyDown, onKeyPress:@onKeyPress },
			React.createElement Text, { styleableText:@state.styleableText }
			# React.createElement 'p', null, 'sup'


module.exports = Test