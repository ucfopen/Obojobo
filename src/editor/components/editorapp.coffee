React = require 'react'

Toolbar = require './editor/toolbar'
TextMenu = require './editor/textmenu'
# ContextMenu = require './editor/contextmenu'
SideMenu = require './editor/sidemenu'
ChunkOptionsMenu = require './editor/chunkoptionsmenu'
StylesMenu = require './editor/stylesmenu'
InsertMenu = require './editor/insertmenu'
DebugMenu = require './editor/debugmenu'
Modal = require './editor/modal'
Selection = require './editor/selection'
StyleBrush = require './editor/stylebrush'
EditorPage = require './editor/editorpage'

Util = require './editor/util'

MutationPainter = require '../../debug/mutationpainter'
# MutationPainter.observe()

ListDetector = require '../../obochunk/list/listdetector'

# Command = require '../commands/command'
StyleType = require '../../text/styletype'

ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

Module = require '../../models/module'
Chunk = require '../../models/chunk'
Metadata = require '../../models/metadata'
ChunkCollection = require '../../models/chunkcollection'








ComponentClassMap.register 'OboChunk.Heading',    require '../../obochunk/heading/editor'
ComponentClassMap.register 'OboChunk.SingleText', require '../../obochunk/singletext/editor'
ComponentClassMap.register 'OboChunk.Break',      require '../../obochunk/break/editor'
ComponentClassMap.register 'OboChunk.YouTube',    require '../../obochunk/youtube/editor'
ComponentClassMap.register 'OboChunk.IFrame',     require '../../obochunk/iframe/editor'
ComponentClassMap.register 'OboChunk.List',       require '../../obochunk/list/editor'
ComponentClassMap.register 'OboChunk.Figure',     require '../../obochunk/figure/editor'
ComponentClassMap.register 'OboChunk.Question',   require '../../obochunk/question/editor'
ComponentClassMap.register 'OboChunk.Table',      require '../../obochunk/table/editor'
ComponentClassMap.register 'OboChunk.HTML',       require '../../obochunk/html/editor'

ComponentClassMap.setDefaultComponentClass require '../../obochunk/singletext/editor'


EditorApp = React.createClass

	getInitialState: ->
		# loDescriptor = require('../../debug/fakelo')

		# module = Module.createFromDescriptor loDescriptor
		module = @props.module or new Module()
		if module.chunks.length is 0
			module.chunks.add Chunk.create()

		#@TODO - Temporary
		module.update = (->
			@setState { lastSaveTime: Date.now() }
		).bind(@)
		# setInterval((->
		# 	@state.module.save() #@TODO - dont save if currently saving
		# ).bind(@), 3000)

		@history = new History
		@selection = new Selection

		window.__history = @history
		window.__lo = module
		window.__s = @selection

		return (
			module: module
			selection: @selection #@TODO
			styleBrush: new StyleBrush()
			spellingSuggestions: []
			modalElement: null
			lastSaveTime: Date.now()
			toolbarCommands: [
				{
					id: 'textType'
					type: 'select'
					label: 'Change text type'
					options: [
						'Heading 1'
						'Heading 2'
						'Normal Text'
					]
					selectedOption: null
				},
				{
					type: 'separator'
				},
				{
					id: 'bold'
					type: 'toggle'
					label: 'Bold text'
					state: 'off'
					img: '/img/editor/toolbar/bold.svg'
				},
				{
					id: 'italic'
					type: 'toggle'
					label: 'Italicize text'
					state: 'off'
					img: '/img/editor/toolbar/italic.svg'
				},
				{
					type: 'separator'
				},
				{
					id: 'ul'
					type: 'button'
					label: 'Transform selection to unordered list'
					img: '/img/editor/toolbar/ul.svg'
				},
				{
					id: 'ol'
					type: 'button'
					label: 'Transform selection to ordered list'
					img: '/img/editor/toolbar/ol.svg'
				},
				{
					type: 'separator'
				},
				{
					id: 'indent'
					type: 'button'
					label: 'Indent'
					img: '/img/editor/toolbar/indent.svg'
				},
				{
					id: 'unindent'
					type: 'button'
					label: 'Unindent'
					img: '/img/editor/toolbar/unindent.svg'
				},
				{
					type: 'separator'
				},
				{
					id: 'image'
					type: 'button'
					label: 'Insert Image'
					img: '/img/editor/toolbar/image.svg'
				},
				{
					id: 'table'
					type: 'gridButton'
					label: 'Insert Table'
					img: '/img/editor/toolbar/table.svg'
				},
				{
					id: 'insert'
					type: 'listButton'
					label: 'Insert'
					img: '/img/editor/toolbar/insert.svg'
					listItems: [
						{ id:'OboChunk.YouTube', label:'Insert YouTube Video' }
					]
				}
			]
		)

	send: (fn, chunkOrChunks, data) ->
		Util.send fn, chunkOrChunks, @state.selection, data

	undo: ->
		history = @history.undo()
		if history.lo then @setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection
			@state.selection.setFutureFromDescriptor history.selection

	redo: ->
		history = @history.redo()
		if history.lo then @setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection
			@state.selection.setFutureFromDescriptor history.selection

	componentDidMount: ->
		document.getElementById('editor').focus()
		@updateSelection()

		#prime the pumps
		@history.add @state.module.toJSON(), @selection.getSelectionDescriptor()

	onTextMenuCommand: (commandLabel) ->
		@selection.runTextCommands commandLabel
		@update()

	onSideMenuClick: (position, componentClass) ->
		if position is 'before'
			newChunk = componentClass.onInsert @selection, @selection.text.start.chunk.get('index'), null, @update
			@selection.text.start.chunk.addBefore newChunk
		else
			newChunk = componentClass.onInsert @selection, @selection.text.end.chunk.get('index') + 1, null, @update
			@selection.text.end.chunk.addAfter newChunk

		@update()

	onToolbarCommand: (command, data) ->
		switch command.id
			when 'textType'
				switch data.option
					when 'Heading 1'
						newChunk = Chunk.create 'OboChunk.Heading'
						newChunk.componentContent.headingLevel = 1
					when 'Heading 2'
						newChunk = Chunk.create 'OboChunk.Heading'
						newChunk.componentContent.headingLevel = 2
					when 'Normal Text'
						newChunk = Chunk.create 'OboChunk.SingleText'

				@send 'transformSelection', newChunk
				# @selectionShouldUpdateAfterRender = true
				@update()
			when 'bold'
				Util.activateStyle StyleType.BOLD, @state.selection, @state.styleBrush
				@updateSelection()
				@update()
			when 'italic'
				Util.activateStyle StyleType.ITALIC, @state.selection, @state.styleBrush
				@updateSelection()
				@update()

			when 'indent'
				@send 'indent', @selection.text.all, [false]
				@update()
			when 'unindent'
				@send 'indent', @selection.text.all, [true]
				@update()
			when 'image'
				@onInsertCommand ComponentClassMap.getClassForType('OboChunk.Figure')
			when 'table'
				@onInsertCommand ComponentClassMap.getClassForType('OboChunk.Table'), data
			when 'insert'
				console.log data.listItem
				componentClass = ComponentClassMap.getClassForType data.listItem
				@onInsertCommand componentClass
			when 'ul'
				newChunk = Chunk.create 'OboChunk.List'
				@send 'transformSelection', newChunk
				@update()

			when 'ol'
				newChunk = Chunk.create 'OboChunk.List'
				newChunk.componentContent.listStyles.type = 'ordered'
				console.log 'createOl', newChunk
				@send 'transformSelection', newChunk
				@update()

	onInsertCommand: (componentClass, data = null) ->
		newChunk = null

		Util.deleteSelection @selection

		switch @send('getCaretEdge', @selection.text.start.chunk)
			when 'start'
				newChunk = componentClass.onInsert @selection, @selection.text.start.chunk.get('index'), data, @update
				@selection.text.start.chunk.addBefore newChunk
			when 'end'
				newChunk = componentClass.onInsert @selection, @selection.text.start.chunk.get('index') + 1, data, @update
				@selection.text.start.chunk.addAfter newChunk
			when 'startAndEnd'
				newChunk = componentClass.onInsert @selection, @selection.text.start.chunk.get('index'), data, @update
				@selection.text.start.chunk.replaceWith newChunk
				console.log '@TODO - WHAT ABOUT SELECTIONS? DO THIS WORK?'
			else
				@send 'splitText', @selection.text.start.chunk
				newChunk = componentClass.onInsert @selection, @selection.text.start.chunk.get('index'), data, @update
				@selection.text.start.chunk.addAfter newChunk

		@send 'selectStart', newChunk

		@update()

	showModal: (component) ->
		@setState { modalElement:component }

	update: ->
		# special case - force at least one chunk!
		if @state.module.chunks.length is 0
			@state.module.chunks.add Chunk.create()

		if not @state.selection.futureStart and not @state.selection.futureEnd
			@state.selection.setFutureFromSelection()

		console.time 'history'
		@history.add @state.module.toJSON(), @state.selection.getFutureDescriptor()
		console.timeEnd 'history'

		@setState {
			module: @state.module
			selection: @state.selection
			styleBrush: @state.styleBrush
		}

	updateSelection: ->
		@state.selection.update @state.module

		textTypeCommand = @state.toolbarCommands[0]
		type = @state.selection.text.start.chunk.get('type')
		headingLevel = 0
		if type is 'OboChunk.Heading'
			headingLevel = @state.selection.text.start.chunk.componentContent.headingLevel

		for chunk in @state.selection.text.all
			if chunk.get('type') isnt type
				type = null
				break
			else if type is 'OboChunk.Heading' and chunk.componentContent.headingLevel isnt headingLevel
				type = null
				break

		if type?
			switch type + headingLevel
				when 'OboChunk.Heading1'
					textTypeCommand.selectedOption = 'Heading 1'
				when 'OboChunk.Heading2'
					textTypeCommand.selectedOption = 'Heading 2'
				else
					textTypeCommand.selectedOption = 'Normal Text'
		else
			textTypeCommand.selectedOption = null

		boldCommand = @state.toolbarCommands[2]
		boldBrushState = @state.styleBrush.getStyleState(StyleType.BOLD)
		boldState = boldBrushState is 'apply' or (boldBrushState isnt 'remove' and @state.selection.styles[StyleType.BOLD])
		boldCommand.state = if boldState then 'on' else 'off'

		italicCommand = @state.toolbarCommands[3]
		italicBrushState = @state.styleBrush.getStyleState(StyleType.ITALIC)
		italicState = italicBrushState is 'apply' or (italicBrushState isnt 'remove' and @state.selection.styles[StyleType.ITALIC])
		italicCommand.state = if italicState then 'on' else 'off'

		@setState {
			selection: @state.selection
			toolbarCommands: @state.toolbarCommands
		}

	onKeyDown: (event) ->
		if event.metaKey or event.ctrlKey
			switch event.keyCode
				when 90 #z
					console.log 'Z'
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

				when 89 #y
					event.preventDefault()
					@redo()

				when 83 #s
					event.preventDefault()
					@state.module.save()

	componentDidUpdate: ->
		console.timeEnd 'renderEditor'

	render: ->
		console.time 'renderEditor'

		saveHistoryFn = @saveHistory
		showModalFn = @showModal
		selection = @selection
		updateFn = @update
		updateSelectionFn = @updateSelection

		React.createElement 'div', {
			onKeyDown: @onKeyDown
			},
			React.createElement Toolbar, {
				selection: @state.selection
				commandHandler: @onToolbarCommand
				commands: @state.toolbarCommands
				}
			React.createElement DebugMenu, { selection:@state.selection, history:@history }, null
			React.createElement SideMenu, {
				selection: @state.selection
				handlerFn: @onSideMenuClick
				inserts: ComponentClassMap.getInserts()
				}
			React.createElement ChunkOptionsMenu, {
				selection: @state.selection
				handlerFn: @onSideMenuClick
				}
			React.createElement TextMenu, { selection:@state.selection, commandHandler:@onTextMenuCommand }
			React.createElement 'div', { style:{color:'gray', position:'absolute', left:0, top:20} }, "Last saved " + (new Date(@state.lastSaveTime))
			React.createElement EditorPage, {
				module:@state.module,
				selection:@state.selection,
				styleBrush:@state.styleBrush,
				updateFn:updateFn,
				updateSelectionFn:updateSelectionFn
			}
			React.createElement Modal, { modalElement:@state.modalElement, showModalFn:showModalFn }


module.exports = EditorApp