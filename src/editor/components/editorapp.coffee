console._log = console.log
console._times = {}
console._interval = null
console.time = (s) ->
	if not console._times[s]
		console._times[s] =
			time: 0
			count: 0
			start: 0
			avg: 0

	console._times[s].start = performance.now()

console.timeEnd = (s) ->
	if console._times[s]?
		diff = performance.now() - console._times[s].start
		console._times[s].count++
		console._times[s].time += diff
		console._times[s].avg = (console._times[s].time / console._times[s].count).toFixed(3)
		# console._log('%c' + s + ': ' + diff.toFixed(3) + 'ms (Avg: ' + console._times[s].avg + 'ms)', 'color: gray;');

	clearTimeout(console._interval)
	console._interval = setTimeout console.showTimeAverages, 1000
	# console.showTimeAverages()

console.showTimeAverages = ->
	byTime = []
	for s of console._times
		byTime.push { s:s, avg:console._times[s].avg }

	byTime.sort (a, b) ->
		if a.avg < b.avg then return 1;
		if a.avg > b.avg then return -1;
		return 0;

	for o in byTime
		console._log('%c' + o.avg + ': ' + o.s, 'color: blue;')
		return #@Todo - hack to only show worst thing


console._error = console.error
console.error = (msg) ->
	if msg.substr(0, 7) is 'Warning'
		if msg.indexOf('Warning: bind()') > -1 or msg.indexOf('contentEditable') > -1 then return false
		console.warn msg #@TODO - SUPRESS WARNINGS
		# false
	else
		console._error msg









linkify = require '../../text/linkify'
StyleableText = require '../../text/styleabletext'

t = new StyleableText()
t.insertText(0, "hey buddy go to www.google.com or http://www.google.com/ or http://website.org or google.com ok?")

console.log 'lets linkify'
linkify(t);

console.log(t);



YAML = require 'yamljs'



# nodehun = require 'nodehun'
# affbuf = fs.readFileSync('../../../assets/spelling/en_US.aff');
# dictbuf = fs.readFileSync('../../../assets/spelling/en_US.dic');
# dict = new nodehun(affbuf,dictbuf);
# dict.spellSuggest 'color', (err, correct, suggestion, origWord) ->
# 	console.log(err, correct, suggestion, origWord);
# 	# because "color" is a defined word in the US English dictionary
# 	# the output will be: null, true, null, 'color'

# dict.spellSuggest 'calor', (err, correct, suggestion, origWord) ->
# 	console.log(err, correct, suggestion, origWord);
# 	# because "calor" is not a defined word in the US English dictionary
# 	# the output will be: null, false, "carol", 'calor'

fs = require 'fs'

Spellchecker = require 'hunspell-spellchecker'
spellchecker = new Spellchecker


dict = spellchecker.parse {
	aff: fs.readFileSync './assets/spelling/en_US.aff'
	dic: fs.readFileSync './assets/spelling/en_US.dic'
}

spellchecker.use dict

console.log 'IS THIS RIGHT'
console.log spellchecker.check('asdf')



React = require 'react'
# window.Perf = require 'react-addons-perf'

Toolbar = require './editor/toolbar'
TextMenu = require './editor/textmenu'
ContextMenu = require './editor/contextmenu'
SideMenu = require './editor/sidemenu'
StylesMenu = require './editor/stylesmenu'
InsertMenu = require './editor/insertmenu'
Modal = require './editor/modal'
Selection = require './editor/selection'
StyleBrush = require './editor/stylebrush'

Screen = require '../../dom/screen'

#@TODO
ListDetector = require '../../obochunk/list/listdetector'

MutationPainter = require '../../debug/mutationpainter'
# MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
StyleType = require '../../text/styletype'

ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

HTMLToOboNodes = require '../import/html'

Module = require '../../models/module'
Chunk = require '../../models/chunk'
Metadata = require '../../models/metadata'
ChunkCollection = require '../../models/chunkcollection'

ss = require 'serialize-selection'

DOMUtil = require '../../dom/domutil'




# m = new Module()
# # m.set('id', 'Y5Nr5')

# m.fetch({
# 	url: 'http://192.168.99.100/api/module/Y5Nr5'
# 	success: ->
# 		console.log('SUCCESS', arguments, m)
# 		window.__m = m
# 	error: -> console.log('ERROR', arguments)
# })
# console.log(m)

# m = new Chunk()
# # m.set('id', 'Y5Nr5')

# m.fetch({
# 	url: 'http://192.168.99.100/api/chunk/2'
# 	success: -> console.log('SUCCESS', arguments, m)
# 	error: -> console.log('ERROR', arguments)
# })
# console.log(m)


# Metadata = require '../../models/metadata'
# m = new Metadata()
# # m.set('id', 'Y5Nr5')

# m.fetch({
# 	url: 'http://192.168.99.100/api/metadata/Y5Nr5'
# 	success: -> console.log('SUCCESS', arguments, m)
# 	error: -> console.log('ERROR', arguments)
# })
# console.log(m)





ComponentClassMap.register 'OboChunk.Heading',    require '../../obochunk/heading/editor'
ComponentClassMap.register 'OboChunk.SingleText', require '../../obochunk/singletext/editor'
ComponentClassMap.register 'OboChunk.Break',      require '../../obochunk/break/editor'
ComponentClassMap.register 'OboChunk.YouTube',    require '../../obochunk/youtube/editor'
ComponentClassMap.register 'OboChunk.IFrame',     require '../../obochunk/iframe/editor'
ComponentClassMap.register 'OboChunk.List',       require '../../obochunk/list/editor'
ComponentClassMap.register 'OboChunk.Figure',     require '../../obochunk/figure/editor'
ComponentClassMap.register 'OboChunk.Question',   require '../../obochunk/question/editor'
ComponentClassMap.register 'OboChunk.Table',      require '../../obochunk/table/editor'

ComponentClassMap.setDefaultComponentClass require '../../obochunk/singletext/editor'


EditorApp = React.createClass

	getInitialState: ->
		# loDescriptor = require('../../debug/fakelo')

		# module = Module.createFromDescriptor loDescriptor
		module = @props.module

		#@TODO - Temporary
		module.update = (->
			@setState { lastSaveTime: Date.now() }
		).bind(@)
		# setInterval((->
		# 	@state.module.save() #@TODO - dont save if currently saving
		# ).bind(@), 3000)

		@history = new History
		@selection = new Selection
		@screen = new Screen

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
				},
			]
		)

	deleteSelection: (sel) ->
		return if sel.type is 'caret'

		for node in sel.inbetween
			node.remove()

		# console.log 'DS', sel.start.chunk
		@send 'deleteSelection', sel.start.chunk

		if sel.type is 'nodeSpan'
			# console.log 'DS', sel.end.chunk
			@send 'deleteSelection', sel.end.chunk
			if @send('canMergeWith', sel.end.chunk, [sel.start.chunk])
				@send 'merge', sel.start.chunk, [sel.end.chunk]

		sel.collapse()

	activateStyle: (style) ->
		if @selection.sel.type is 'caret'
			@state.styleBrush.add style, @selection.styles[style]?
		else
			if @selection.styles[style]?
				@send 'unstyleSelection', @selection.sel.all, [style]
			else
				@send 'styleSelection', @selection.sel.all, [style]

	# EVENTS

	onKeyDown: (event) ->
		# return true
		# console.log event.keyCode
		# if event.keyCode is 83
		# 	event.preventDefault()
		# 	if not event.shiftKey
		# 		console.clear()
		# 		@__savedSelection = s = @selection.getSelectionDescriptor()
		# 		console.log JSON.stringify(s, null, 2)
		# 		return
		# 	else
		# 		console.clear()
		# 		@selection.selectFromDescriptor @state.module, @__savedSelection
		# 		return

		# if event.keyCode is 67 and event.shiftKey
		# 	console.clear()
		# 	event.preventDefault()

			# newChunk = Chunk.create 'OboChunk.Heading'
			# newChunk.componentContent.headingLevel = 1
			# @send 'transformSelection', newChunk
			# @update()

			# @onToolbarCommand 'createUl'
			# return

		if event.keyCode is 192
			# event.preventDefault()
			# console.clear()
			# console.log JSON.stringify(@selection.sel.start.chunk.componentContent, null, 2)
			# return
			console.clear()
			event.preventDefault()

			if event.shiftKey
				@history.__debug_print()




		# @updateSelection()
		@updateSelection()

		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				event.preventDefault()
				if @selection.sel.type is 'caret'
					caretEdge = @send 'getCaretEdge', @selection.sel.start.chunk
					deleteForwards = event.keyCode is Keyboard.DELETE
					chunk = @selection.sel.start.chunk
					prev = chunk.prevSibling()
					next = chunk.nextSibling()

					deleteSuccessful = @send 'deleteText', chunk, [deleteForwards]

					if not deleteSuccessful
						switch
							# If cursor is at the start and this is a backspace
							when (caretEdge is 'start' or caretEdge is 'startAndEnd') and not deleteForwards
								# If both chunks agree to be merged with each other
								if @send('canMergeWith', chunk, [prev]) and @send('canMergeWith', prev, [chunk])
									#... then previousSibling will merge with this chunk
									@send 'merge', prev, [chunk]
								else if @send('canRemoveSibling', chunk, [prev])
									#... else previousSibling simply gets deleted
									prev.remove()

							# If cursor is at the end and this is a foward delete
							when (caretEdge is 'end' or caretEdge is 'startAndEnd') and deleteForwards
								# If both chunks agree to be merged with each other
								if @send('canMergeWith', chunk, [next]) and @send('canMergeWith', next, [chunk])
									#... then this chunk will merge with nextSibling
									@send 'merge', chunk, [next]
								else if @send('canRemoveSibling', chunk, [next])
									#... else nextSibling simply gets deleted
									next.remove()
				else
					@deleteSelection @selection.sel

				@update()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()

				# If more than one chunk is selected...
				if @selection.sel.type is 'nodeSpan'
					# ...indent all of them
					@send 'indent', @selection.sel.all, [event.shiftKey]
					@update()
					return

				# If tabbing at the start of the text...
				caretEdge = @send 'getCaretEdge', @selection.sel.start.chunk
				if caretEdge is 'start' or caretEdge is 'startAndEnd'
					# ...indent
					@send 'indent', @selection.sel.start.chunk, [event.shiftKey]
					@update()
					return

				# Otherwise, let the chunk figure out what to do
				@send 'onTab', @selection.sel.start.chunk, [event.shiftKey]
				@update()

				# @deleteSelection @selection.sel
				# @send 'insertText', @selection.sel.start.chunk, ["\t"]
				# @update()


			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				@deleteSelection @selection.sel
				@send 'splitText', @selection.sel.start.chunk, [event.shiftKey]
				@update()

			#@TODO - are these the only ways to change the cursor with the keyboard?
			when Keyboard.LEFT_ARROW, Keyboard.RIGHT_ARROW, Keyboard.UP_ARROW, Keyboard.DOWN_ARROW
				# @history.add null, @selection.getSelectionDescriptor()

				if not @state.styleBrush.isClean
					@state.styleBrush.clean()
					@update()

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()

					@activateStyle StyleType.BOLD

					@updateSelection()
					@update()

				when 73 #i
					event.preventDefault()

					@activateStyle StyleType.ITALIC

					@updateSelection()
					@update()


				when 65 #a
					if @selection.sel.type isnt 'nodeSpan'
						if @send 'selectAll', @selection.sel.start.chunk
							event.preventDefault()
							# @updateSelection()
							@update()

				when 90 #z
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

				when 89 #y
					event.preventDefault()
					@redo()

				when 83 #s
					event.preventDefault()
					@state.module.save()

	onKeyPress: (event) ->
		@updateSelection()
		# console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode





		@sendText char






	# #@TODO
	# updateSelection: () ->
	# 	return @updateSelection()

	# 	OboSelection = require '../../obodom/selection/oboselection'
	# 	console.time 'updateSelection'
	# 	# editorEl = document.getElementById 'editor'
	# 	# s = window.getSelection()
	# 	# r = s.getRangeAt 0

	# 	# start = @getSelectionPath2 r.startContainer, editorEl
	# 	# end = @getSelectionPath2 r.endContainer, editorEl

	# 	# sel = start.concat(end).concat(r.startOffset).concat(r.endOffset).join(' ')
	# 	# console.log 'updateSelection', sel, @lastSel, sel == @lastSel
	# 	# @lastSel = sel


	# 	# sel = ss.save editorEl
	# 	# console.log sel



	# 	sel = JSON.stringify (new OboSelection @state.module).getDescriptor()
	# 	# console.log 'new selection?', sel isnt @lastSel


	# 	if sel isnt @lastSel
	# 		@updateSelection()

	# 	console.timeEnd 'updateSelection'
	# 	@lastSel = sel





	onKeyUp: (event) ->
		@updateSelection()

		# @state.styleBrush = {}
		# if @nextStyle
			# @state.styleBrush[@nextStyle] = @nextStyle
			# delete @nextStyle

		# @updateSelection()


	onPaste: (event) ->
		@contextMenuOpen = false
		console.log 'ON PASTE!'
		# @beforeSend()

		event.preventDefault()

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		# if html.length > 0
			# @sendHTML html
		# else
			# @sendText text
		@sendText text

	onMouseDown: (event) ->
		@selection.clear()
		@state.styleBrush.clean()
		true

	onMouseUp: (event) ->
		# setTimeout (->
		# 	@updateSelection()
		# 	@history.add null, @selection.getSelectionDescriptor()
		# ).bind(@), 0
		# true
		setTimeout @updateSelection.bind(@), 0
		true

	onContextMenu: (event) ->
		@startPath = @getSelectionPath(r.startContainer, editorEl)

		event.preventDefault()
		console.clear()
		selectedText = document.getSelection().toString()
		suggestions = []
		if not spellchecker.check(selectedText)

			console.time 'spellcheck'
			suggestions = spellchecker.suggest selectedText, 3
			console.timeEnd 'spellcheck'
			console.log suggestions

		@setState {
			spellingSuggestions: suggestions
			contextMenuActive: true
		}
		return

		# console.clear()
		console.log 'ocm'
		console.log event
		s = window.getSelection()
		r = s.getRangeAt(0)
		console.log s, r
		@selection.update @state.module
		console.log JSON.stringify(@selection.getSelectionDescriptor(), null, 2)
		# document.execCommand("insertHTML", false, "<span class='own-class'>"+ document.getSelection()+"</span>");
		# console.log document.body.innerHTML
		@contextMenuOpen = true
		@storedSelection = @selection.getSelectionDescriptor()

		# s.surroundContents document.createElement('blockquote')

		r.startContainer.parentNode.id = '___start'
		@start = r.startContainer.parentNode.innerText

		# @d = document.createElement 'div'
		# @d.setAttribute 'contenteditable', true
		# console.log @selection.sel.start.node
		# @d.innerHTML = @selection.sel.start.node.parentElement.innerHTML

		editorEl = document.getElementById('editor')
		@clone = editorEl.cloneNode true
		@clone.id = ''
		@startPath = @getSelectionPath(r.startContainer, editorEl)
		@startOffset = r.startOffset
		@endPath = @getSelectionPath(r.endContainer, editorEl)
		@endOffset = r.endOffset

		console.log @startPath, @endPath

		# r.setStartBefore r.startContainer
		startNode = r.endContainer
		startOffset = r.endOffset
		endNode = r.startContainer
		endOffset = r.startOffset

		# r.selectNode editorEl.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]


		# r = new Range()
		# r.selectNodeContents editorEl
		# r.setStart startNode, startOffset
		# s.removeAllRanges()
		# s.addRange r
		# document.execCommand 'delete'


		# r = new Range()
		# r.selectNodeContents editorEl
		# r.setEnd endNode, endOffset
		# s.removeAllRanges()
		# s.addRange r
		# document.execCommand 'delete'

		console.log 'cool'

		true

	getSelectionPath: (node, finalParent) ->
		console.time 'getSelectionPath'
		path = []
		while node isnt finalParent
			path.push Array.prototype.indexOf.call(node.parentNode.childNodes, node)
			node = node.parentNode
		console.timeEnd 'getSelectionPath'

		path

	selectByPath: (path, node) ->
		console.log 'selectByPath'
		while path.length > 0
			node = node.childNodes[path.pop()]
			console.log 'now node is', node, path

		node



	onCut: (event) ->
		@contextMenuOpen = false
		@deleteSelection @selection.sel
		@update()

	onClick: (event) ->
		# console.log 'onClick', @state

		# clickedChunkIndex = parseInt DOMUtil.findParentAttr(event.target, 'data-component-index'), 10
		# clickedChunk = @state.module.chunks.at clickedChunkIndex
		# if clickedChunk?
		# 	console.log JSON.stringify(clickedChunk.toJSON(), null, 2)

		if @state.activeChunk?
			clickedChunkIndex = parseInt DOMUtil.findParentAttr(event.target, 'data-component-index'), 10
			clickedChunk = @state.module.chunks.at clickedChunkIndex

			if not clickedChunk? or @state.activeChunk isnt clickedChunk
				@setState { activeChunk:null }

	onMouseOver: (event) ->
		if @contextMenuOpen
			@contextMenuOpen = false
			console.log 'You clicked on Delete, or did spellcheck, or something weird'

			# d2 = document.createElement 'div'
			# d2.setAttribute 'contenteditable', true
			# d2.innerHTML = @selection.sel.start.node.parentElement.innerHTML

			# console.log @d, d2

			# start = document.getElementById('__start')

			beforeHTML = @clone.innerHTML

			document.body.appendChild @clone
			s = window.getSelection()
			r = new Range

			startNode = @selectByPath @startPath, @clone
			endNode = @selectByPath @endPath, @clone

			console.log 'SELECT', startNode, @startOffset
			console.log 'SELECT', endNode, @endOffset

			r.setStart startNode, @startOffset
			r.setEnd endNode, @endOffset

			s.removeAllRanges()
			s.addRange r

			document.execCommand 'delete'

			beforeText = @clone.textContent
			afterText = document.getElementById('editor').textContent

			@clone.parentNode.removeChild @clone

			console.log afterText.replace(/\s/g, '')
			console.log beforeText.replace(/\s/g, '')
			console.log ''
			console.log ''
			console.log ''
			console.log ''
			console.log afterText
			console.log beforeText
			console.log ''
			console.log ''
			console.log ''
			console.log ''
			console.log ''
			console.log afterText.replace(/\s/g, '') == beforeText.replace(/\s/g, '')

			didDelete = afterText.replace(/\s+/g, '') == beforeText.replace(/\s+/g, '')

			# Needed so chunks can still call getEl
			console.log @clone.innerHTML
			document.getElementById('editor').innerHTML = beforeHTML
			@selection.selectFromDescriptor @state.module, @storedSelection

			if didDelete
				console.log 'DID DELETE!'
				console.log 'DID DELETE!'
				console.log 'DID DELETE!'
				console.log 'DID DELETE!'
				console.log 'DID DELETE!'
				console.log 'DID DELETE!'

				console.log 'delete selection', JSON.stringify(@selection.getSelectionDescriptor(), null, 2)
				console.log @, @deleteSelection
				@deleteSelection @selection.sel
				@update()
			else
				window.dafuk = beforeText
				beforeWords = beforeText.replace(/\s+/g, ' ').split(' ')
				afterWords = afterText.replace(/\s+/g, ' ').split(' ')

				bt = beforeText.replace(/\s+/g, ' ')
				for i in [0..bt.length]
					console.log bt.charAt(i), bt.charCodeAt(i)

				newWords = []
				i = 0
				console.log 'FIND'
				console.log beforeText.replace(/\s+/g, ' '), beforeWords
				console.log afterText.replace(/\s+/g, ' '), afterWords
				for afterWord in afterWords
					beforeWord = beforeWords[i]
					console.log 'compare', beforeWord, 'to', afterWord
					if afterWord is beforeWord
						console.log 'same'
						if newWords.length > 0
							break
						i++
					else
						console.log 'found new word', afterWord
						newWords.push afterWord

				console.log 'newWords', newWords

				newStr = newWords.join(' ')

				@sendText newStr









	# onTextInput: (event) ->
	# 	console.log 'ontextinput', event.data

	# onInput: (event) ->
	# 	console.log 'oninput', event

	# onChange: (event) ->
	# 	console.log 'onchange', event

	updateSelection: ->
		# console.log 'updateSelection'
		# @state.styleBrush = {}
		# curSel = @selection.getSelectionDescriptor()
		@selection.update @state.module
		# nextSel = @selection.getSelectionDescriptor()

		textTypeCommand = @state.toolbarCommands[0]
		type = @selection.sel.start.chunk.get('type')
		headingLevel = 0
		if type is 'OboChunk.Heading'
			headingLevel = @selection.sel.start.chunk.componentContent.headingLevel

		for chunk in @selection.sel.all
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

		boldCommand = @state.toolbarCommands[1]
		boldBrushState = @state.styleBrush.getStyleState(StyleType.BOLD)
		boldState = boldBrushState is 'apply' or (boldBrushState isnt 'remove' and @selection.styles[StyleType.BOLD])
		boldCommand.state = if boldState then 'on' else 'off'

		italicCommand = @state.toolbarCommands[2]
		italicBrushState = @state.styleBrush.getStyleState(StyleType.ITALIC)
		italicState = italicBrushState is 'apply' or (italicBrushState isnt 'remove' and @selection.styles[StyleType.ITALIC])
		italicCommand.state = if italicState then 'on' else 'off'

		# @history.add null, @selection.getSelectionDescriptor()

		@setState {
			selection: @selection
			toolbarCommands: @state.toolbarCommands
			# newSelection: JSON.stringify(curSel) == JSON.stringify(nextSel) #@TODO, assumes object order
			# styleBrush: @state.styleBrush
		}






	sendHTML: (html) ->
		chunks = HTMLToOboNodes(html)

		@deleteSelection @selection.sel
		@send 'splitText', @selection.sel.start.chunk
		splitNode = @selection.sel.start.chunk.nextSibling()
		for chunk in chunks
			splitNode.addBefore chunk

		@send 'selectEnd', chunks[chunks.length - 1]

		@update()

	sendText: (char) ->

		#@TODO - move this somewhere

		if char is ' '
			if @selection.sel.type is 'caret' and @selection.sel.start.chunk.get('type') is 'OboChunk.SingleText' and @send('getCaretEdge', @selection.sel.start.chunk) is 'end'
				group = @selection.sel.start.chunk.componentContent.textGroup
				console.log ListDetector
				listDetails = ListDetector group.last.text.value + ' '
				console.log listDetails
				if listDetails isnt false
					group.last.text.init()
					newChunk = Chunk.create 'OboChunk.List'
					listStyles = newChunk.componentContent.listStyles
					listStyles.type = listDetails.type
					listStyles.set 0, { start:listDetails.symbolIndex, bulletStyle:listDetails.symbolStyle }
					@send 'transformSelection', newChunk
					@update()
					return

		if char is '-'
			if @selection.sel.type is 'caret' and @selection.sel.start.chunk.get('type') is 'OboChunk.SingleText' and @send('getCaretEdge', @selection.sel.start.chunk) is 'end'
				group = @selection.sel.start.chunk.componentContent.textGroup
				if group.last.text.value is '--'
					newChunk = Chunk.create 'OboChunk.Break'
					@selection.sel.start.chunk.replaceWith newChunk
					newChunk2 = Chunk.create 'OboChunk.SingleText'
					newChunk.addAfter newChunk2
					@send 'selectStart', newChunk2
					@update()
					return




		# if char is 'c'
		# 	console.clear()
		# 	return

		# if char is 'p'
		# 	styles = @callComponentFn 'getSelectionStyles', @selection.sel.start.chunk
		# 	console.log 'STYLES:', styles
		# 	return

		# console.log 'sendText', char, @nextStyle

		styleBrush = @state.styleBrush

		@deleteSelection @selection.sel
		@send 'insertText', @selection.sel.start.chunk, [char, styleBrush.stylesToApply, styleBrush.stylesToRemove]
		@update()

		# if char is ' ' and @selection.sel.start.chunk.get('type') is 'singletext'
			# linkify @selection.sel.start.chunk.componentContent.textGroup.get(0).text

	# beforeSend: ->
	# 	console.time 'send'
	# 	console.time 'cycle'

	# 	console.time 'ss'
	# 	@savedSelection = @selection.sel.getDescriptor()
	# 	console.timeEnd 'ss'

	send: (fn, chunkOrChunks, data = []) ->
		if not (chunkOrChunks instanceof Array)
			return chunkOrChunks.callComponentFn fn, @selection, data

		chunks = chunkOrChunks
		results = []
		for chunk in chunks
			results.push chunk.callComponentFn fn, @selection, data

		results

	update: ->
		# console.log 'update'
		# console.time 'toDescriptor'
		# @loDescriptor =
		# console.timeEnd 'toDescriptor'

		# console.timeEnd 'send'

		# @historyShouldUpdate = true

		# special case - force at least one chunk!
		if @state.module.chunks.length is 0
			@state.module.chunks.add Chunk.create()


		console.time 'getFutureDescriptor'
		# @TODO - this is gross (also does it break anything?)
		console.log 'test', @selection.sel.futureStart, @selection.sel.futureEnd
		if not @selection.sel.futureStart and not @selection.sel.futureEnd
			console.log 'sffs'
			@selection.setFutureFromSelection()
		@selectionPending = @selection.getFutureDescriptor()
		console.log 'futuredescriptor', @selectionPending
		console.timeEnd 'getFutureDescriptor'

		@selection.sel.clearFuture()

		console.time 'history'
		@history.add @state.module.toJSON(), @selectionPending
		console.timeEnd 'history'

		@setState {
			module: @state.module
			selection: @state.selection
			styleBrush: @state.styleBrush
		}


	undo: ->
		history = @history.undo()
		if history.lo then @setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	redo: ->
		history = @history.redo()
		if history.lo then @setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	componentDidMount: ->
		# Disable table resizing in FF
		document.execCommand "enableObjectResizing", false, "false"
		document.execCommand "enableInlineTableEditing", false, "false"

		document.getElementById('editor').focus()
		@updateSelection()

		#prime the pumps
		@history.add @state.module.toJSON(), @selection.getSelectionDescriptor()

	componentDidUpdate: ->
		console.timeEnd 'render'
		# console.log 'COMPONENT DID UPDATE'

		# @screen.restoreScrollPosition()

		if @selectionPending
			# console.log 'selection pending!'
			# console.log @selectionPending
			# document.getElementById('editor').focus()
			@selection.selectFromDescriptor @state.module, @selectionPending, @selectAfterTimeout
			delete @selectionPending
			delete @selectAfterTimeout
		# else
			# @selection.selectFuture @state.module

		# if @historyShouldUpdate
		# 	delete @historyShouldUpdate
		# 	@history.add @state.module.toJSON(), @selection.getSelectionDescriptor()

		# @history.__debug_print()
		# setTimeout (->
		# 	@screen.scrollSelectionIntoViewIfNeeded()
		# ).bind(@), 1000
		@screen.tweenSelectionIntoViewIfNeeded()

		#Nasty hack
		if @selectionShouldUpdateAfterRender
			delete @selectionShouldUpdateAfterRender
			# @selection.update @state.module
			# @setState { selection:@selection }
			@updateSelection()

		# console.timeEnd 'cycle'
		# console.timeEnd 'kpCycle'

	onTextMenuCommand: (commandLabel) ->
		# @beforeSend()
		@selection.runTextCommands commandLabel

		# for chunk in @selection.sel.all
			# @selection.runCommand(commandLabel, chunk)

		@selectionShouldUpdateAfterRender = true
		@updateSelection()
		@update()

	onSideMenuClick: (position, componentClass) ->


		if position is 'before'
			newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index')
			@selection.sel.start.chunk.addBefore newChunk
			# @send 'selectStart', newChunk
		else
			newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index') + 1
			@selection.sel.end.chunk.addAfter newChunk
			# @send 'selectEnd', newChunk

		# console.log 'selection  is', @selection.sel, JSON.stringify(@selection.sel.futureStart)

		# @selectionShouldUpdateAfterRender = true
		@selectAfterTimeout = true
		@update()

	onContextMenuCommand: (event) ->
		# console.log 'ocmc', arguments

		switch event.type
			when 'spelling'
				@sendText event.data
			when 'command'
				switch event.data
					when 'Cut', 'Delete'
						@deleteSelection @selection.sel

		@update()


	onToolbarCommand: (command, data) ->
		@selectAfterTimeout = true

		console.log 'onToolbarCommand', arguments

		# console.log 'otc', command
		switch command.id
			# when 'SAVE'
			# 	@state.module.save()
			# 	# @update()
			# when 'REDRAW'
			# 	@update()
			when 'textType'
				console.log 'data.option', data
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
				@selectionShouldUpdateAfterRender = true
				@update()
			when 'bold'
				@activateStyle StyleType.BOLD
				@updateSelection()
				@update()
			when 'italic'
				@activateStyle StyleType.ITALIC
				@updateSelection()
				@update()

			when 'indent'
				@send 'indent', @selection.sel.all, [false]
				@update()
			when 'unindent'
				@send 'indent', @selection.sel.all, [true]
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

			# when 'H1'
			# 	# @transformSelection @selection.sel, ->
			# 	# 	newChunk = Chunk.create 'heading'
			# 	# 	newChunk.componentContent.headingLevel = 1
			# 	# 	newChunk
			# 	newChunk = Chunk.create 'OboChunk.Heading'
			# 	newChunk.componentContent.headingLevel = 1
			# 	@send 'transformSelection', newChunk
			# 	@update()

			# when 'H2'
			# 	newChunk = Chunk.create 'OboChunk.Heading'
			# 	newChunk.componentContent.headingLevel = 2
			# 	@send 'transformSelection', newChunk
			# 	@update()

			# when 'P'
			# 	newChunk = Chunk.create 'OboChunk.SingleText'
			# 	@send 'transformSelection', newChunk
			# 	@update()

	onInsertCommand: (componentClass, data = null) ->
		console.log 'ea.oic', componentClass

		newChunk = null

		@deleteSelection @selection.sel
		switch @send('getCaretEdge', @selection.sel.start.chunk)
			when 'start'
				newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index'), data
				@selection.sel.start.chunk.addBefore newChunk
			when 'end'
				newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index') + 1, data
				@selection.sel.start.chunk.addAfter newChunk
			when 'startAndEnd'
				newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index'), data
				@selection.sel.start.chunk.replaceWith newChunk
				console.log '@TODO - WHAT ABOUT SELECTIONS? DO THIS WORK?'
			else
				@send 'splitText', @selection.sel.start.chunk
				newChunk = componentClass.onInsert @selection, @selection.sel.start.chunk.get('index'), data
				@selection.sel.start.chunk.addAfter newChunk

		@send 'selectStart', newChunk

		@selectionShouldUpdateAfterRender = true
		@update()

	# transformSelection: (sel, createChunkFn) ->
	# 	sel.setFutureFromSelection()

	# 	for chunk in sel.all
	# 		newChunk = createChunkFn()

	# 		@send 'init', newChunk
	# 		@send 'absorb', newChunk, [[chunk]]

	# 		chunk.replaceWith newChunk

	# 	@update()

	absorbSelection: (newChunk, sel) ->
		sel.setFutureFromSelection()

		# put the list into the page (before the selected nodes)
		sel.start.chunk.addBefore newChunk

		# remove all the selected nodes
		for chunk in sel.all
			chunk.remove()

		@send 'init', newChunk
		@send 'absorb', newChunk, [sel.all]

		@update()

	#@TODO - Name this something better
	activateChunk: (chunk) ->
		console.log 'ACTIVATE', chunk

		@setState {
			activeChunk: chunk
		}

	showModal: (component) ->
		@setState { modalElement:component }

	render: ->
		# console.log 'EDITOR APP RENDER'

		console.time 'render'

		saveHistoryFn = @saveHistory
		activateFn = @activateChunk
		showModalFn = @showModal

		activeChunk = @state.activeChunk

		# block

		# console.log 'activeChunk is', activeChunk

		# console.log 'new selection?', @state.newSelection
		# { style:{ background:(if @state.newSelection then 'red' else 'white') } }

		stackStr = ''
		# if @history?.stack?.length > 0

			# d = @history.stack[@history.stack.length - 1].lo
			# for c in d.chunks
				# stackStr += JSON.stringify(c, null, 2) + "\n"
		# stackStr = stackStr.replace(/^\s*[{}]+\s*$/gm, '').replace(/\n\n+/gm, "\n")
		if @state.selection?.sel?.all?.length > 0
			for chunk in @state.selection.sel.all
				stackStr += JSON.stringify chunk.toJSON(), null, 2

		React.createElement 'div', null,
			React.createElement 'pre', { style:{fontSize:'7pt',position:'fixed', left:'70%', bottom:'0', right: '0', zIndex: 1, overflow:'scroll', background:'white'} }, stackStr
			React.createElement Toolbar, {
				selection: @state.selection
				commandHandler: @onToolbarCommand
				commands: @state.toolbarCommands
				}
			# React.createElement StylesMenu, {
			# 	selection: @state.selection
			# 	styleBrush: @state.styleBrush
			# 	}
			# React.createElement InsertMenu, {
			# 	selection: @state.selection
			# 	# commands: ['OboChunk.Heading', 'OboChunk.SingleText', 'OboChunk.Break', 'OboChunk.YouTube', 'OboChunk.IFrame', 'OboChunk.List', 'OboChunk.Figure', 'OboChunk.Question', 'OboChunk.Table']
			# 	inserts: ComponentClassMap.getInserts()
			# 	commandHandler: @onInsertCommand
			# 	}
			React.createElement SideMenu, {
				selection: @state.selection
				handlerFn: @onSideMenuClick
				inserts: ComponentClassMap.getInserts()
				}
			React.createElement TextMenu, { selection:@state.selection, commandHandler:@onTextMenuCommand }
			React.createElement ContextMenu, { selection:@state.selection, commandHandler:@onContextMenuCommand, spellingSuggestions:@state.spellingSuggestions, active:@state.contextMenuActive }
			React.createElement 'div', { style:{color:'gray', position:'absolute', left:0, top:20} }, "Last saved " + (new Date(@state.lastSaveTime))
			React.createElement 'div', {
				id: 'editor',
				className: 'content'
				# onKeyDown: if not activeChunk? then @onKeyDown else null,
				# onKeyPress: if not activeChunk? then @onKeyPress else null,
				# onKeyUp: if not activeChunk? then @onKeyUp else null,
				# onPaste: if not activeChunk? then @onPaste else null,
				# onCut: if not activeChunk? then @onCut else null,
				# onMouseDown: if not activeChunk? then @onMouseDown else null,
				# onMouseUp: if not activeChunk? then @onMouseUp else null,
				# onContextMenu: if not activeChunk? then @onContextMenu else null,
				# onMouseOver: if not activeChunk? then @onMouseOver else null,
				onKeyDown: @onKeyDown,
				onKeyPress: @onKeyPress,
				onKeyUp: @onKeyUp,
				onPaste: @onPaste,
				onCut: @onCut,
				onMouseDown: @onMouseDown,
				onMouseUp: @onMouseUp,
				onContextMenu: @onContextMenu,
				onMouseOver: @onMouseOver,
				onClick: @onClick
				# onTextInput: @onTextInput,
				# onInput: @onInput,
				# onChange: @onChange
				# onInput: @onInput,
				contentEditable: true
			},
				@state.module.chunks.models.map (chunk, index) ->
					component = chunk.getComponent()

					React.createElement 'div', {
						className: 'component'
						'data-component-type': chunk.get 'type'
						'data-component-index': index
						'data-oboid': chunk.cid
						'data-server-index': chunk.get 'index'
						# 'data-server-index': JSON.stringify(chunk.changedAttributes())
						# 'data-server-index': chunk.dirty
						'data-server-id': chunk.get 'id'
						'data-server-derived-from': chunk.get 'derivedFrom'
						# 'data-encoded-stuff': if component.encodeStuff? then component.encodeStuff(chunk) else ''
						'data-changed': chunk.dirty
						key: index
						style: {
							opacity: if not activeChunk? or chunk is activeChunk then '1' else '0.2'
						}
					},
						React.createElement component, {
							chunk: chunk
							updateFn: @update
							activateFn: activateFn
							showModalFn: showModalFn
							isActive: activeChunk is chunk
						}
			React.createElement Modal, { modalElement:@state.modalElement, showModalFn:showModalFn }



module.exports = EditorApp