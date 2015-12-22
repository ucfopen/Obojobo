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


console._error = console.error
console.error = (msg) ->
	if msg.substr(0, 7) is 'Warning'
		console.warn msg
	else
		console._error msg









linkify = require '../../text/linkify'
StyleableText = require '../../text/styleabletext'

t = new StyleableText()
t.insertText(0, "hey buddy go to www.google.com or http://www.google.com/ or http://website.org or google.com ok?")

console.log 'lets linkify'
linkify(t);

console.log(t);







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
Selection = require './editor/selection'

Screen = require '../../dom/screen'

#@TODO
ListDetector = require '../../obochunk/list/listdetector'

MutationPainter = require '../../debug/mutationpainter'
MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
StyleType = require '../../text/styletype'

ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

HTMLToOboNodes = require '../import/html'

Module = require '../../models/module'
Chunk = require '../../models/chunk'

ss = require 'serialize-selection'

DOMUtil = require '../../dom/domutil'



ComponentClassMap.register 'heading',    require '../../obochunk/heading/editor'
ComponentClassMap.register 'singletext', require '../../obochunk/singletext/editor'
ComponentClassMap.register 'break',      require '../../obochunk/break/editor'
ComponentClassMap.register 'youtube',    require '../../obochunk/youtube/editor'
ComponentClassMap.register 'iframe',     require '../../obochunk/iframe/editor'
ComponentClassMap.register 'list',       require '../../obochunk/list/editor'
ComponentClassMap.register 'figure',     require '../../obochunk/figure/editor'
ComponentClassMap.register 'question',   require '../../obochunk/question/editor'
ComponentClassMap.register 'table',      require '../../obochunk/table/editor'

ComponentClassMap.setDefaultComponentClass require '../../obochunk/singletext/editor'


EditorApp = React.createClass

	getInitialState: ->
		loDescriptor = require('../../debug/fakelo')

		module = Module.createFromDescriptor loDescriptor

		@history = new History
		@selection = new Selection
		@screen = new Screen

		window.__history = @history
		window.__lo = module
		window.__s = @selection

		return (
			module: module
			selection: @selection #@TODO
			styleBrush: {}
			spellingSuggestions: []
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


	# EVENTS

	onKeyDown: (event) ->
		console.log event.keyCode
		if event.keyCode is 83
			event.preventDefault()
			if not event.shiftKey
				console.clear()
				@__savedSelection = s = @selection.getSelectionDescriptor()
				console.log JSON.stringify(s, null, 2)
				return
			else
				console.clear()
				@selection.selectFromDescriptor @state.module, @__savedSelection
				return

		if event.keyCode is 67 and event.shiftKey
			console.clear()
			event.preventDefault()

			newChunk = Chunk.create 'heading'
			newChunk.get('data').headingLevel = 1
			@send 'transformSelection', newChunk
			@update()

			# @onToolbarCommand 'createUl'
			return



		# @updateSelection()
		@checkSelection()

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

					switch
						# If cursor is at the start and this is a backspace
						when caretEdge is 'start' and not deleteForwards
							# If both chunks agree to be merged with each other
							if @send('canMergeWith', chunk, [prev]) and @send('canMergeWith', prev, [chunk])
								#... then previousSibling will merge with this chunk
								@send 'merge', prev, [chunk]
							else
								#... else previousSibling simply gets deleted
								prev.remove()

						# If cursor is at the end and this is a foward delete
						when caretEdge is 'end' and deleteForwards
							# If both chunks agree to be merged with each other
							if @send('canMergeWith', chunk, [next]) and @send('canMergeWith', next, [chunk])
								#... then this chunk will merge with nextSibling
								@send 'merge', chunk, [next]
							else
								#... else nextSibling simply gets deleted
								next.remove()

						else
							@send 'deleteText', chunk, [event.keyCode is Keyboard.DELETE]

				else
					@deleteSelection @selection.sel

				@update()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()
				@send 'indent', @selection.sel.all, [event.shiftKey]
				@update()

			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				@deleteSelection @selection.sel
				@send 'splitText', @selection.sel.start.chunk, [event.shiftKey]
				@update()

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()
					@nextStyle = StyleType.BOLD

					if @selection.styles[StyleType.BOLD]?
						@send 'unstyleSelection', @selection.sel.all, [StyleType.BOLD]
					else
						@send 'styleSelection', @selection.sel.all, [StyleType.BOLD]

					@update()

				when 73 #i
					event.preventDefault()
					@nextStyle = StyleType.ITALIC
					@send 'styleSelection', @selection.sel.all, [StyleType.ITALIC]

					if @selection.styles[StyleType.ITALIC]?
						@send 'unstyleSelection', @selection.sel.all, [StyleType.ITALIC]
					else
						@send 'styleSelection', @selection.sel.all, [StyleType.ITALIC]

					@update()

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
		@checkSelection()
		# console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode





		@sendText char






	#@TODO
	checkSelection: () ->
		return @updateSelection()

		OboSelection = require '../../obodom/selection/oboselection'
		console.time 'checkSelection'
		# editorEl = document.getElementById 'editor'
		# s = window.getSelection()
		# r = s.getRangeAt 0

		# start = @getSelectionPath2 r.startContainer, editorEl
		# end = @getSelectionPath2 r.endContainer, editorEl

		# sel = start.concat(end).concat(r.startOffset).concat(r.endOffset).join(' ')
		# console.log 'checkSelection', sel, @lastSel, sel == @lastSel
		# @lastSel = sel


		# sel = ss.save editorEl
		# console.log sel



		sel = JSON.stringify (new OboSelection @state.module).getDescriptor()
		# console.log 'new selection?', sel isnt @lastSel


		if sel isnt @lastSel
			@updateSelection()

		console.timeEnd 'checkSelection'
		@lastSel = sel





	onKeyUp: (event) ->
		@checkSelection()

		@state.styleBrush = {}
		if @nextStyle
			@state.styleBrush[@nextStyle] = @nextStyle
			delete @nextStyle

		# @updateSelection()


	onPaste: (event) ->
		@contextMenuOpen = false
		console.log 'ON PASTE!'
		# @beforeSend()

		event.preventDefault()

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		if html.length > 0
			@sendHTML html
		else
			@sendText text

	onMouseDown: (event) ->
		@selection.clear()
		@state.styleBrush = {}
		true

	onMouseUp: (event) ->
		setTimeout @checkSelection.bind(@), 0
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
		console.log 'onClick', @state

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



		@setState {
			selection: @selection
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
			if @selection.sel.type is 'caret' and @selection.sel.start.chunk.get('type') is 'singletext' and @send('getCaretEdge', @selection.sel.start.chunk) is 'end'
				group = @selection.sel.start.chunk.get('data').textGroup
				console.log ListDetector
				listDetails = ListDetector group.last.text.value + ' '
				console.log listDetails
				if listDetails isnt false
					group.last.text.init()
					newChunk = Chunk.create 'list'
					listStyles = newChunk.get('data').listStyles
					listStyles.type = listDetails.type
					listStyles.set 0, { start:listDetails.symbolIndex, bulletStyle:listDetails.symbolStyle }
					@send 'transformSelection', newChunk
					@update()
					return

		if char is '-'
			if @selection.sel.type is 'caret' and @selection.sel.start.chunk.get('type') is 'singletext' and @send('getCaretEdge', @selection.sel.start.chunk) is 'end'
				group = @selection.sel.start.chunk.get('data').textGroup
				if group.last.text.value is '--'
					newChunk = Chunk.create 'break'
					@selection.sel.start.chunk.replaceWith newChunk
					newChunk2 = Chunk.create 'singletext'
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

		@deleteSelection @selection.sel
		@send 'insertText', @selection.sel.start.chunk, [char, Object.keys(@state.styleBrush)]
		@update()

		if char is ' ' and @selection.sel.start.chunk.get('type') is 'singletext'
			linkify @selection.sel.start.chunk.get('data').textGroup.get(0).text

	# beforeSend: ->
	# 	console.time 'send'
	# 	console.time 'cycle'

	# 	console.time 'ss'
	# 	@savedSelection = @selection.sel.getDescriptor()
	# 	console.timeEnd 'ss'

	send: (fn, chunkOrChunks, data = []) ->
		if not (chunkOrChunks instanceof Array)
			return chunkOrChunks.callComponentFn fn, @selection.sel, data

		chunks = chunkOrChunks
		results = []
		for chunk in chunks
			results.push chunk.callComponentFn fn, @selection.sel, data

		results

	update: ->
		# console.log 'update'
		# console.time 'toDescriptor'
		# @loDescriptor =
		# console.timeEnd 'toDescriptor'

		# console.timeEnd 'send'

		# @historyShouldUpdate = true


		console.time 'getFutureDescriptor'
		# @TODO - this is gross (also does it break anything?)
		if not @selection.sel.futureStart and not @selection.sel.futureEnd
			@selection.sel.setFutureFromSelection()
		@selectionPending = @selection.getFutureDescriptor()
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
		@setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	redo: ->
		history = @history.redo()
		@setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	componentDidMount: ->
		#prime the pumps
		@history.add @state.module.toJSON(), null

		# Disable table resizing in FF
		document.execCommand "enableObjectResizing", false, "false"
		document.execCommand "enableInlineTableEditing", false, "false"

	componentDidUpdate: ->
		console.timeEnd 'render'
		# console.log 'COMPONENT DID UPDATE'

		if @selectionPending
			# console.log 'selection pending!'
			# console.log @selectionPending
			document.getElementById('editor').focus()
			@selection.selectFromDescriptor @state.module, @selectionPending
			delete @selectionPending
		# else
			# @selection.selectFuture @state.module

		# if @historyShouldUpdate
		# 	delete @historyShouldUpdate
		# 	@history.add @state.module.toJSON(), @selection.getSelectionDescriptor()

		# @history.__debug_print()
		# @screen.scrollSelectionIntoViewIfNeeded()
		@screen.tweenSelectionIntoViewIfNeeded()

		#Nasty hack
		if @selectionShouldUpdate
			delete @selectionShouldUpdate
			@selection.update @state.module
			@setState { selection:@selection }

		# console.timeEnd 'cycle'
		# console.timeEnd 'kpCycle'

	onTextMenuCommand: (commandLabel) ->
		# @beforeSend()

		for chunk in @selection.sel.all
			@selection.runCommand(commandLabel, chunk)

		@update()

	onSideMenuClick: (position) ->
		newChunk = Chunk.create()

		if position is 'before'
			@selection.sel.start.chunk.addBefore newChunk
			@send 'selectStart', newChunk
		else
			@selection.sel.end.chunk.addAfter newChunk
			@send 'selectEnd', newChunk

		# console.log 'selection  is', @selection.sel, JSON.stringify(@selection.sel.futureStart)

		@selectionShouldUpdate = true
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


	onToolbarCommand: (command) ->
		# console.log 'otc', command
		switch command
			when 'indent'
				@send 'indent', @selection.sel.all, [false]
				@update()
			when 'unindent'
				@send 'indent', @selection.sel.all, [true]
				@update()
			when 'createUl'
				newChunk = Chunk.create 'list'
				@send 'transformSelection', newChunk
				@update()

			when 'createOl'
				newChunk = Chunk.create 'list'
				newChunk.get('data').listStyles.type = 'ordered'
				console.log 'createOl', newChunk
				@send 'transformSelection', newChunk
				@update()

			when 'H1'
				# @transformSelection @selection.sel, ->
				# 	newChunk = Chunk.create 'heading'
				# 	newChunk.get('data').headingLevel = 1
				# 	newChunk
				newChunk = Chunk.create 'heading'
				newChunk.get('data').headingLevel = 1
				@send 'transformSelection', newChunk
				@update()

			when 'H2'
				newChunk = Chunk.create 'heading'
				newChunk.get('data').headingLevel = 2
				@send 'transformSelection', newChunk
				@update()

			when 'P'
				newChunk = Chunk.create 'singletext'
				@send 'transformSelection', newChunk
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

	render: ->
		console.log 'EDITOR APP RENDER'

		console.time 'render'

		saveHistoryFn = @saveHistory
		activateFn = @activateChunk

		activeChunk = @state.activeChunk

		console.log 'activeChunk is', activeChunk

		# console.log 'new selection?', @state.newSelection
		# { style:{ background:(if @state.newSelection then 'red' else 'white') } }

		React.createElement 'div', null,
			React.createElement Toolbar, {
				selection: @state.selection
				commandHandler: @onToolbarCommand
				}
			React.createElement StylesMenu, {
				selection: @state.selection
				styleBrush: @state.styleBrush
				}
			React.createElement SideMenu, {
				selection: @state.selection
				handlerFn: @onSideMenuClick
				}
			React.createElement TextMenu, { selection:@state.selection, commandHandler:@onTextMenuCommand }
			React.createElement ContextMenu, { selection:@state.selection, commandHandler:@onContextMenuCommand, spellingSuggestions:@state.spellingSuggestions, active:@state.contextMenuActive }
			React.createElement 'div', {
				id: 'editor'
				onKeyDown: if not activeChunk? then @onKeyDown else null,
				onKeyPress: if not activeChunk? then @onKeyPress else null,
				onKeyUp: if not activeChunk? then @onKeyUp else null,
				onPaste: if not activeChunk? then @onPaste else null,
				onCut: if not activeChunk? then @onCut else null,
				onMouseDown: if not activeChunk? then @onMouseDown else null,
				onMouseUp: if not activeChunk? then @onMouseUp else null,
				onContextMenu: if not activeChunk? then @onContextMenu else null,
				onMouseOver: if not activeChunk? then @onMouseOver else null,
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
						# 'data-encoded-stuff': if component.encodeStuff? then component.encodeStuff(chunk) else ''
						'data-changed': chunk.hasChanged()
						key: index
						style: {
							opacity: if not activeChunk? or chunk is activeChunk then '1' else '0.2'
						}
					},
						React.createElement component, {
							chunk: chunk
							updateFn: @update
							activateFn: activateFn
							isActive: activeChunk is chunk
						}



module.exports = EditorApp