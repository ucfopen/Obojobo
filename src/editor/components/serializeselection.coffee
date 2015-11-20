React = require 'react'
SerializeSelection = require 'serialize-selection'

MutationPainter = require '../../debug/mutationpainter'
MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
CommandEvent = require '../commands/commandevent'
StyleType = require '../../text/styletype'

ComponentMap = require '../../util/componentmap'
ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

OboNodeUtil = require '../../obodom/obonodeutil'
descriptorToNode = require '../../obodom/descriptortonode'

OboReact = require '../../oboreact/oboreact'

OboSelection = require '../../obodom/selection/oboselection'
OboSelectionRange = require '../../obodom/selection/oboselectionrange'

# @TODO - Dynamically or batch load all components
components =
	# editabletext: require './editabletext'
	paragraph:    require './paragraph'
	figure:       require './figure'
	list:         require './list'

Test = require './test'

window.__ss = SerializeSelection



# start:
#		oboNode: <OBO NODE>
#		cursor:
#			node: <DOM NODE>
#			offset: <INT>
# inbetween: <ARRAY{OBO NODE}>
# end:
#		oboNode: <OBO NODE>
#		cursor:
#			node: <DOM NODE>
#			offset: <INT>
# type: type

# class OboRange2
# 	constructor: (@sel, targetNode) ->
# 		@start = new OboCursor2
# 		@end   = new OboCursor2

# 		if targetNode.contains @sel.start.node
# 			@start.node = @sel.start.node
# 			@start.offset  = @sel.start.offset
# 		else
# 			@start.node =

class OboSelection2
	constructor: (root) ->
		s = window.getSelection()
		r = s.getRangeAt(0)

		start = @getIndex r.startContainer.parentElement
		end   = @getIndex r.endContainer.parentElement

		# start = start.split('.')[1]
		# end   = end.split('.')[1]

		start = root.children[start]
		end   = root.children[end]

		inbetween = []
		allOboNodes = [start]

		n = start
		while n isnt end
			if n isnt start
				inbetween.push n
				allOboNodes.push n
			n = n.nextSibling

		if start is end
			if s.type is 'Caret'
				type = 'caret'
			else
				type = 'textSpan'
		else
			type = 'nodeSpan'

		allOboNodes.push end

		@start     = new OboCursor2(start, r.startContainer, r.startOffset)
		@inbetween = inbetween
		@end       = new OboCursor2(end, r.endContainer, r.endOffset)
		@all       = allOboNodes
		@type      = type

	getRange: (parentElement) ->
		hasStart = parentElement.contains @start.node
		hasEnd   = parentElement.contains @end.node

		if not hasStart and not hasEnd then return 'insideOrOutside'
		if     hasStart and not hasEnd then return 'start'
		if not hasStart and     hasEnd then return 'end'
		'both'

	getIndex: (node) ->
		while node?
			if node.getAttribute('data-component-index')?
				return node.getAttribute('data-component-index')
			node = node.parentElement

	setStart: (node, offset) ->
		@start.node = node
		@start.offset = offset

	setEnd: (node, offset) ->
		@end.node = node
		@end.offset = offset

	setCaret: (node, offset) ->
		@setStart node, offset
		@collapse()

	select: ->
		return if not @start.node? or not @end.node?

		s = window.getSelection()
		r = new Range

		r.setStart @start.node, @start.offset
		r.setEnd @end.node, @end.offset

		s.removeAllRanges()
		s.addRange r

	collapse: ->
		@end = @start.clone()

# Object.defineProperties OboSelection2.prototype, {
# 	"type": {
# 		get: ->

# 	}
# }

class OboCursor2
	constructor: (@oboNode = null, @node = null, @offset = null) ->

	clone: ->
		new OboCursor2 @oboNode, @node, @offset



callTree = (path, commandEvent, range) ->
	for selNode in path
		component = selNode.component
		# console.log 'callTree', selNode, component

		if component and component.handleCommand?
			# console.log '_', component.handleCommand
			component.handleCommand commandEvent, range
			break if commandEvent.propagationStopped

	#@TODO - this crappy (use promises???)
	for cb in commandEvent.callbacks
		cb commandEvent

	commandEvent.callbacks = []


EditorApp = React.createClass

	getInitialState: ->
		loDescriptor = require('../../debug/fakelo')

		ComponentClassMap.register 'paragraph',    components.paragraph
		ComponentClassMap.register 'list',         components.list
		ComponentClassMap.register 'listItem',     components.listItem
		# ComponentClassMap.register 'editabletext', components.editabletext
		ComponentClassMap.register 'figure',       components.figure
		ComponentClassMap.register 'question',     require './question'

		root = descriptorToNode loDescriptor

		console.log 'lo be all lke', loDescriptor
		window.__lo = root
		console.log 'root be all like', root

		@loDescriptor = loDescriptor
		@history = new History();

		return (
			root: root
		)

# Command.INSERT = 'insert' #insertText
# Command.NEW_LINE = 'newLine' #split or remove
# Command.DELETE = 'delete' #remove or deleteText, [then merge]
# Command.CUT = 'cut' #getHTML, then remove or deleteText
# Command.STYLE = 'style' #setStyle
# Command.INDENT = 'indent' #indent or indentText

# caret, textSpan, nodeSpan


# start:
#		oboNode: <OBO NODE>
#		cursor:
#			node: <DOM NODE>
#			offset: <INT>
# inbetween: <ARRAY{OBO NODE}>
# end:
#		oboNode: <OBO NODE>
#		cursor:
#			node: <DOM NODE>
#			offset: <INT>
# type: type


# DeleteSelection()
#	inbetweens.remove()
#		@state.oboNode.remove()
#	start.deleteSelection(sel)
#		...
#	end.deleteSelection(sel)
#		...
#		sel.end.node = aNode?
#		sel.end.offset -= n
#	start.merge(end)
#		...
#	sel.setEndToEqualTheStart()

# INSERT
#	DeleteSelection()
#	start.insertText(sel.start.cursor, 'f')
#		...
#		sel.start.node = something?
#		sel.start.offset += n

# DELETE
#	If Caret
#		start.deleteText(sel)
#	Else
#		DeleteSelection()

# NEW_LINE
#	DeleteSelection()
#	start.split(sel.start.cursor)

# CUT
#	AllNodes.getHTML(sel)
#	DeleteSelection()

# STYLE
#	AllNodes.styleSelection(sel)

# INDENT
#	AllNodes.indentSelection(sel)


	# DeleteSelection()
	#	inbetweens.remove()
	#		@state.oboNode.remove()
	#	start.deleteSelection(sel)
	#		...
	#	end.deleteSelection(sel)
	#		...
	#		sel.end.node = aNode?
	#		sel.end.offset -= n
	#	start.merge(end)
	#		...
	#	sel.setEndToEqualTheStart()
	deleteSelection: (sel) ->
		return if sel.type is 'caret'

		for node in sel.inbetween
			node.remove()

		@callComponentFn 'deleteSelection', @sel.start.oboNode

		if sel.type is 'nodeSpan'
			@callComponentFn 'deleteSelection', @sel.end.oboNode
			@callComponentFn 'merge', @sel.start.oboNode, [@sel.end.oboNode]
		# 	# @sel.end.oboNode.remove()

		sel.collapse()

	onKeyDown: (event) ->
		@sel = new OboSelection2(@state.root)

		# console.log event.keyCode
		# return
		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				console.log 'yo dogs'
				event.preventDefault()
				if @sel.type is 'caret'
					caretEdge = @callComponentFn 'getCaretEdge', @sel.start.oboNode
					deleteForwards = event.keyCode is Keyboard.DELETE
					switch
						when caretEdge is 'start' and not deleteForwards
							@send 'merge', @sel.start.oboNode.prevSibling, [@sel.start.oboNode]
						when caretEdge is 'end' and deleteForwards
							@send 'merge', @sel.start.oboNode, [@sel.start.oboNode.nextSibling]
						else
							@send 'deleteText', @sel.start.oboNode, [event.keyCode is Keyboard.DELETE]
				else
					@beforeSend()
					@deleteSelection @sel
					@afterSend()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()
				@send 'indent', @sel.all, [event.shiftKey]

			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				@deleteSelection @sel
				@send 'split', @sel.start.oboNode, [event.shiftKey]

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()
					@send 'style', @sel.all, [StyleType.BOLD]

				when 73 #i
					event.preventDefault()
					@send 'style', @sel.all, [StyleType.ITALIC]

				#
				# when 65 #a
				# 	event.preventDefault()
				# 	@send Command.SELECT_ALL

				when 90 #z
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

				when 89 #y
					event.preventDefault()
					@redo()

	onKeyPress: (event) ->
		# return
		console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode
		# @handleKey char, event

		@selLater = @sel.start.oboNode

		@deleteSelection @sel
		@send 'insertText', @sel.start.oboNode, [char]

	# handleKey: (char, event) ->
	# 	switch event.keyCode
	# 		when Keyboard.ENTER
	# 			if event.shiftKey
	# 				@send Command.INSERT_TEXT, ["\n"]
	# 			else
	# 				@send Command.SPLIT_TEXT, null
	# 		else @send Command.INSERT_TEXT, [char]

	beforeSend: ->
		console.time 'send'
		console.time 'cycle'
		# console.log '>>>>>>>>>>>>>>>>>>>SEND', fn, nodeOrNodes, data

		console.time 'ss'
		@ss = SerializeSelection.save()
		console.timeEnd 'ss'

		#prime the pumps
		if @history.length is 0
			@history.add @loDescriptor, @ss

	afterSend: ->
		console.time 'toDescriptor'
		@loDescriptor = @state.root.toDescriptor true
		console.timeEnd 'toDescriptor'

		console.timeEnd 'send'

		@onChildUpdate()

	send: (fn, nodeOrNodes, data = []) ->
		@beforeSend()

		if nodeOrNodes instanceof Array
			nodes = nodeOrNodes
		else
			nodes = []
			nodes.push nodeOrNodes

		# console.log 'ok den', nodes

		for node in nodes
			@callComponentFn fn, node, data

		@afterSend()

	callComponentFn: (fn, node, data) ->
		if node.componentClass? and node.componentClass[fn]?
			return node.componentClass[fn].apply node.componentClass, [@sel, node].concat(data)

		null

	sendOLD: (command, data = []) ->
		# return
		@sel = new OboSelection()


		startComponent = @sel.start.path.last.component
		endComponent   = @sel.end.path.last.component

		return if not startComponent or not endComponent

		#prime the pumps
		if @history.length is 0
			@history.add @loDescriptor, @sel.toDescriptor()

		commandEvent = new CommandEvent command, @sel, data
		@selectionPending = @sel

		if @sel.type isnt 'nodeRange'
			callTree @sel.start.path.all, commandEvent, new OboSelectionRange('only', @sel.start.textIndex, @sel.end.textIndex, @sel.start.oboNode)
		else
			callTree @sel.start.path.all, commandEvent, new OboSelectionRange('start', @sel.start.textIndex, Infinity, @sel.start.oboNode)

			nodePath = @sel.path
			console.log 'node path be all', nodePath
			for oboNode in nodePath.slice(1, -1)
				component = ComponentMap.getComponentById oboNode.id
				if component?
					component.handleCommand commandEvent, new OboSelectionRange('inside', 0, Infinity, oboNode)

			callTree @sel.end.path.all, commandEvent, new OboSelectionRange('end', 0, @sel.end.textIndex, @sel.end.oboNode)

		console.time 'toDescriptor'
		@loDescriptor = @state.root.toDescriptor true
		console.timeEnd 'toDescriptor'

		@onChildUpdate commandEvent

	undo: ->
		history = @history.undo()
		console.log 'UNDO RESTORE', history.lo
		console.log descriptorToNode(history.lo)
		@setState({ root:descriptorToNode(history.lo) })
		if history.selection
			@selectionPending = history.selection

	redo: () ->
		history = @history.redo()
		@setState({ root:descriptorToNode(history.lo) })
		if history.selection
			@selectionPending = history.selection

	onChildUpdate: (commandResult) ->
		@sel.select()
		@tempSel = SerializeSelection.save()

		@setState { root:@state.root }

	componentDidUpdate: ->
		if @ss
			@history.add @loDescriptor, @ss
			@ss = null

		if @tempSel
			console.time 'ssr'
			SerializeSelection.restore(@tempSel)
			console.timeEnd 'ssr'
			delete @tempSel

		# if @selLater and @selLater.componentClass? and @selLater.componentClass.updateSelection?
		# 	@selLater.componentClass.updateSelection @sel
		# 	@selLater = null
		# 	@sel.select()
		# else if @selectionPending
		# 	SerializeSelection.restore @selectionPending
		# 	@selectionPending = null
		console.timeEnd 'cycle'
		console.timeEnd 'kpCycle'



	componentDidUpdateOLD: ->
		# if we didn't do an undo/redo, push to history
		if @sel
			@history.add @loDescriptor, @sel.toDescriptor()

		if @selectionPending
			@selectionPending.select()
			@selectionPending = null

		@sel = null

		console.log @history

		console.timeEnd 'kp'

	saveHistory: ->
		@loDescriptor = @state.root.toDescriptor true
		@history.add @loDescriptor, null

	# renderTEST: ->
	# 	React.createElement 'div', null,
	# 		React.createElement Test
	# 		OboReact.createElement 'div', @state.root, '0',
	# 			{
	# 				onClick: @onClick,
	# 				onKeyDown: @onKeyDown,
	# 				onKeyPress: @onKeyPress,
	# 				contentEditable: true,
	# 			},
	# 			# OboReact.createChildren @state.root, '0',
	# 			React.createElement Test

	render: ->
		OboReact.createElement 'div', @state.root, '0',
			{
				onClick: @onClick,
				onKeyDown: @onKeyDown,
				onKeyPress: @onKeyPress,
				contentEditable: true,
			},
			@state.root.children.map (childNode, index) ->
				newIndex = '0.' + index
				React.createElement 'div', { className:'component', 'data-component-index':index, 'data-oboid':childNode.id },
					OboReact.createElement childNode.componentClass, childNode, newIndex, { oboNode:childNode, index:newIndex, parentIndex:'0', 'data-butts':'a' }
			# OboReact.createChildren @state.root, '0'

	# renderOLD: ->
	# 	oboNode = @state.root

	# 	children = []
	# 	for childNode, i in oboNode.children
	# 		continue if not childNode.componentClass

	# 		children.push React.createElement childNode.componentClass, {
	# 			ref: oboNode.type + i,
	# 			oboNode: childNode,
	# 			key: childNode.id,
	# 			index: i,
	# 			saveHistory: @saveHistory,
	# 			parentIndex: '0'
	# 		}

	# 	React.createElement 'div', {
	# 		'data-oboid': oboNode.id,
	# 		'data-obo-type': oboNode.type,
	# 		'data-obo-index': 0,
	# 		'data-new-obo-id': '0',
	# 		contentEditable: true,
	# 		onClick: @onClick
	# 		onKeyDown: @onKeyDown
	# 		onKeyPress: @onKeyPress
	# 		onKeyUp: @onKeyUp
	# 	}, children



module.exports = EditorApp