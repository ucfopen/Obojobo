require './editorpage.scss'

InputHandler = require 'Editor/chunk/inputhandler'
ChunkClipboard = require '../history/chunkclipboard'

Common = window.ObojoboDraft.Common
Keyboard = Common.page.Keyboard
StyleType = Common.text.StyleType
#@TODO:

Chunk = Common.models.Chunk
DOMUtil = Common.page.DOMUtil
ChunkUtil = Common.chunk.util.ChunkUtil
ChunkEl = Common.components.Chunk
VirtualSelection = Common.selection.VirtualSelection
DeleteButton = Common.components.DeleteButton

###
A better focus alg

componentWillReceiveProps: (nextProps) ->
	console.clear()
	console.log 'CWRP???', @props.selectionState, nextProps.selectionState

	if @props.selectionState isnt nextProps.selectionState
		if nextProps.selectionState is 'contains'
			console.log 'T'
			@props.chunk.markForUpdate()
			@setState {
				focused: true
			}
		else if @props.selectionState is 'contains'
			console.log 'F'
			@props.chunk.markForUpdate()
			@setState {
				focused: false
			}
###

EditorPage = React.createClass

	getInitialState: ->
		@chunkClipboard = new ChunkClipboard()
		@inputHandler = new InputHandler()

		#@TODO
		window.__cc = @chunkClipboard

		window.__send = ((fn, chunkOrChunks, data) -> @send(fn, chunkOrChunks, data)).bind(@)
		window.__do = (chunkIndexArray, componentFn, args) ->
			console.clear()

			chunks = []
			for index in chunkIndexArray
				chunks.push __lo.chunks.at(index)

			# __lo.chunks.at(chunkIndex).callComponentFn componentFn, __s, args
			rtn = __send componentFn, chunks, args
			__force({})

			rtn
		window.__setSel = (startIndex = 0, startGroupIndex = 0, startOffset = 0, endIndex = null, endGroupIndex = null, endOffset = null) ->
			if not endIndex?      then endIndex = startIndex
			if not endGroupIndex? then endGroupIndex = startGroupIndex
			if not endOffset?     then endOffset = startOffset
			__s.setFutureFromDescriptor {
				start:
					index: startIndex
					data:
						groupIndex: startGroupIndex
						offset: startOffset
				end:
					index: endIndex
					data:
						groupIndex: endGroupIndex
						offset: endOffset
			}
			__force({})

		key: 0

	forcePageRerender: (data) ->
		@forcedRerenderPayload = data
		@setState { key:@state.key + 1 }

	send: (fn, chunkOrChunks, data) ->
		ChunkUtil.send fn, chunkOrChunks, @props.selection, data

	onKeyDownPutChunkOnClipboard: (event, chunk, afterCallback = ->) ->
		if (event.keyCode is 67 or event.keyCode is 88) and (event.ctrlKey or event.metaKey)
			@copyHijackCallback = afterCallback
			console.log @copyHijackCallback

			# @chunkClipboard.store chunk

			hijackEl = @createCopyHijackElement chunk
			document.body.appendChild hijackEl

			hijackEl.focus()
			hijackEl.select()

			return true

		false

	createCopyHijackElement: (chunk) ->
		el = document.createElement 'textarea'
		el.style.position = 'fixed'
		# el.style.top = '-9999px'
		el.style.top = '-9999px'
		el.style.left = '0'
		el.style.zIndex = '999999'
		# el.textContent = 'obochunk:' + chunk.get('id').toJSON()
		# el.textContent = 'obochunk:' + JSON.stringify(chunk.toJSON())
		el.textContent = chunk.getDomEl().textContent
		el.id = 'obojobo-draft-engine-copy-field'
		el.addEventListener 'keyup', @onCopyHijackElementKeyUp

		@chunkClipboard.storeChunksByText [chunk], el.textContent

		# console.clear()
		# console.log '****'
		# console.log el.textContent

		el

	onCopyHijackElementKeyUp: (event) ->
		# console.clear()
		console.log @copyHijackCallback

		if @copyHijackCallback
			@destroyCopyHijackElement()

			@copyHijackCallback()
			delete @copyHijackCallback

		@props.updateSelectionFromDOMFn()

	destroyCopyHijackElement: ->
		el = document.getElementById 'obojobo-draft-engine-copy-field'
		if el?
			el.parentElement.removeChild el

	onEvent: (event) ->
		return if not @props.enabled

		switch event.type
			when 'keydown'     then @onKeyDown     event
			when 'keypress'    then @onKeyPress    event
			when 'keyup'       then @onKeyUp       event
			when 'paste'       then @onPaste       event
			when 'copy'        then @onCopy        event
			when 'cut'         then @onCut         event
			when 'mousedown'   then @onMouseDown   event
			when 'mouseup'     then @onMouseUp     event
			when 'input'       then @onInput       event
			when 'contextmenu' then @onContextMenu event

	onKeyDown: (event) ->
		if @copyHijackCallback then return true

		if not event.metaKey and not event.altKey and not event.ctrlKey
			@props.screen.tweenSelectionIntoViewIfNeeded()

		@props.updateSelectionFromDOMFn()
		result = @inputHandler.onKeyDown event, @props.selection, @props.styleBrush

		if result
			@props.saveAndRenderModuleFn()

	onContextMenu: ->
		@props.updateSelectionFromDOMFn()

	onInput: (event) ->
		if @blockInputEvent?
			delete @blockInputEvent
			return

		# Chunk span selections are not supported, so revert
		if @props.selection.virtual.type is 'chunkSpan'
			@forcePageRerender {
				callback: (->
					setTimeout ( ->
						@props.saveAndRenderModuleFn()
					).bind(@)
				).bind(@)
			}
			return

		inputActivityData =
			chunk: @props.selection.startChunk
			savedDOMState: @props.selection.startChunk.getDOMStateBeforeInput()
			callback: ( (data) ->
				data.chunk.applyDOMModification data.domModification

				setTimeout ( ->
					@props.saveAndRenderModuleFn()
					@props.screen.scrollSelectionIntoViewIfNeeded()
				).bind(@)
			).bind(@)

		@props.selection.saveVirtualSelection()

		inputActivityData.domModification = inputActivityData.chunk.getDOMModificationAfterInput(inputActivityData.savedDOMState)

		@props.updateSelectionFromDOMFn() #@TODO?
		@props.selection.restoreVirtualSelection()

		@forcePageRerender inputActivityData

		true

	onKeyPress: (event) ->
		@props.updateSelectionFromDOMFn()

		event.preventDefault()

		char = String.fromCharCode event.charCode

		@sendText char

	onKeyUp: (event) ->
		@props.updateSelectionFromDOMFn()

		if event.keyCode is Keyboard.SPACE
			@props.triggerKeyListeners();

		true

	saveSelectionToClipboard: ->
		@chunkClipboard.clear()

		toStore = []
		for chunk in @props.selection.virtual.all
			toStore.push chunk.getCopyOfSelection(true)

		@chunkClipboard.storeChunksByText toStore, window.getSelection().toString()

	onCopy: (event) ->
		@saveSelectionToClipboard()
		true

	onCut: (event) ->
		@blockInputEvent = true

		@saveSelectionToClipboard()

		@props.updateSelectionFromDOMFn()

		forcedRerenderData =
			selection: @props.selection.getSelectionDescriptor()
			callback: ( ->
				ChunkUtil.deleteSelection @props.selection
				@props.saveAndRenderModuleFn()
			).bind(@)

		setTimeout ( ->
			@forcePageRerender forcedRerenderData
		).bind(@)

		true

	onPaste: (event) ->
		event.preventDefault()

		@props.selection.update()

		ChunkUtil.deleteSelection @props.selection

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		pastedChunks = []
		storedChunks = @chunkClipboard.get text
		# console.clear()
		console.log text, html, storedChunks
		if storedChunks?
			pastedChunks = storedChunks
		else
			# assume the paste was from elsewhere, so remove our hack clipboard
			@chunkClipboard.clear()

		pasteSuccessful = @props.selection.startChunk.paste text, html, pastedChunks

		console.log 'pasteSuccessful?', pasteSuccessful

		if pasteSuccessful
			@props.saveAndRenderModuleFn()
			return

		if pastedChunks.length > 0
			@insertPastedChunks pastedChunks
			return

		@sendText text

	insertPastedChunks: (pastedChunks) ->


		# console.clear()
		# console.log '___________________insert pasted chunks'
		# console.log pastedChunks

		ChunkUtil.deleteSelection @props.selection

		refChunk = @props.selection.startChunk
		refChunkCaretEdge = refChunk.getCaretEdge()
		refChunk.split()

		for chunk in pastedChunks
			console.log 'refChunk'
			refChunk.addChildAfter chunk
			refChunk = chunk
			console.log 'add in', chunk.get('type'), chunk

		@props.selection.startChunk.remove()

		if refChunkCaretEdge is 'start' or refChunkCaretEdge is 'startAndEnd'
			refChunk.nextSibling().selectStart()
		else
			refChunk.selectEnd()

		@props.saveAndRenderModuleFn()

	onMouseDown: (event) ->
		@props.onMouseDown(@props.page, @props.pageIndex)

		# console.log 'OMD', JSON.stringify(@props.selection.getSelectionDescriptor(), null, 2)
		@props.selection.clear()
		@props.styleBrush.clean()
		true

	onMouseUp: (event) ->
		# console.log 'OMU', JSON.stringify(@props.selection.getSelectionDescriptor(), null, 2)
		setTimeout @props.updateSelectionFromDOMFn.bind(null, false)
		true

	onClick: (event) ->
		# console.log 'OC', JSON.stringify(@props.selection.getSelectionDescriptor(), null, 2)
		clickedChunkIndex = ~~DOMUtil.findParentAttr(event.target, 'data-component-index')
		clickedChunk = @props.page.chunks.at clickedChunkIndex

		if @props.editingChunk isnt null and @props.editingChunk isnt clickedChunk
			# console.log '______'
			@props.stopEditing()
			@props.saveAndRenderModuleFn()

		# @props.onClick(@props.page, @props.pageIndex)

	sendText: (char) ->
		styleBrush = @props.styleBrush

		ChunkUtil.deleteSelection @props.selection

		console.time 'sendText'
		@props.selection.startChunk.insertText char, styleBrush.stylesToApply, styleBrush.stylesToRemove
		console.timeEnd 'sendText'

		@props.saveAndRenderModuleFn()

	componentDidMount: ->
		# Disable table resizing in FF
		document.execCommand "enableObjectResizing", false, "false"
		document.execCommand "enableInlineTableEditing", false, "false"

	componentDidUpdate: ->
		console.timeEnd 'renderPage'

		if @forcedRerenderPayload and @forcedRerenderPayload.callback?
			@forcedRerenderPayload.callback @forcedRerenderPayload

		delete @forcedRerenderPayload

	focusOnEditor: ->
		@refs.editor.focus()

	selectStart: ->
		console.log 'SELECT START'
		@focusOnEditor()
		@props.page.chunks.at(0).selectStart()

	selectEnd: ->
		@focusOnEditor()
		@props.page.chunks.at(@props.page.chunks.length - 1).selectEnd()

	onDeleteButtonClick: ->
		@props.deletePage(@props.page)

	render: ->
		console.time 'renderPage'

		saveHistoryFn = @saveHistory
		editChunkFn = @props.editChunk
		stopEditingFn = @props.stopEditing
		window.__activateFn = @activateChunk #@TODO
		showModalFn = @props.showModalFn
		selection = @props.selection
		saveAndRenderModuleFn = @props.saveAndRenderModuleFn
		chunkClipboard = @chunkClipboard
		onEvent = @onEvent
		onKeyDownPutChunkOnClipboard = @onKeyDownPutChunkOnClipboard
		updateSelectionFromDOMFn = @props.updateSelectionFromDOMFn
		editingChunk = @props.editingChunk
		loading = @props.loading
		module = @props.module
		pageIndex = @props.pageIndex

		curChunkSel = VirtualSelection.fromDOMSelection @props.page
		# console.log 'curchunkSel is', curChunkSel
		# curChunkSel = @state.selection.virtual

		chunks = `this.props.page.chunks.models.map(function(chunk, index) {
			var Component = chunk.getComponent();
			var chunkSelectionState = curChunkSel ? curChunkSel.getPosition(chunk) : 'none';

			return (<div
				className={'component selection-' + chunkSelectionState + (editingChunk === chunk ? ' editing-chunk' : ' not-editing-chunk')}
				data-component-type={chunk.get('type')}
				data-component-index={index}
				data-page-index={pageIndex}
				data-oboid={chunk.cid}
				data-id={chunk.get('id')}
				data-server-index={chunk.get('index')}
				data-server-id={chunk.get('id')}
				data-server-derived-from={chunk.get('derivedFrom')}
				data-changed={chunk.dirty}
				data-todo={chunk.get('index') + ':' + chunk.get('id')}
				key={chunk.get('id')}
			>
				<Component
					chunk={chunk}
					saveAndRenderModuleFn={saveAndRenderModuleFn}
					editChunk={editChunkFn}
					stopEditing={stopEditingFn}
					showModalFn={showModalFn}
					isEditing={editingChunk === chunk}
					selection={selection}
					selectionState={chunkSelectionState}
					updateSelectionFromDOMFn={updateSelectionFromDOMFn}
					module={module}
					chunkClipboard={chunkClipboard}
					onKeyDownPutChunkOnClipboard={onKeyDownPutChunkOnClipboard}
					shouldPreventTab={editingChunk !== null && editingChunk !== chunk}
				/>
			</div>);
		});`

		`<div
			className={'editor--components--editor-page' + (editingChunk !== null ? ' editing' : '')}
			key={this.state.key}
			data-cid={this.props.page.cid}
			onKeyDown={this.onEvent}
			onKeyPress={this.onEvent}
			onKeyUp={this.onEvent}
			onPaste={this.onEvent}
			onCut={this.onEvent}
			onCopy={this.onEvent}
			onMouseDown={this.onEvent}
			onMouseUp={this.onEvent}
			onContextMenu={this.onEvent}
			onInput={this.onEvent}
			onClick={this.onClick}
			ref="editor"
		>
			<div
				className="chunks"
				contentEditable={this.props.pageEdit}
				suppressContentEditableWarning={true}
			>
				{chunks}
			</div>
			<DeleteButton onClick={this.onDeleteButtonClick} />
		</div>`



module.exports = EditorPage