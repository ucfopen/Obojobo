module.exports =
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
		# console.log @selection.chunk.start.node
		# @d.innerHTML = @selection.chunk.start.node.parentElement.innerHTML

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

	onPaste: (event) ->
		@contextMenuOpen = false

	onCut: (event) ->
		@contextMenuOpen = false
		@deleteSelection @selection.chunk
		@update()

	onMouseOver: (event) ->
		if @contextMenuOpen
			@contextMenuOpen = false
			console.log 'You clicked on Delete, or did spellcheck, or something weird'

			# d2 = document.createElement 'div'
			# d2.setAttribute 'contenteditable', true
			# d2.innerHTML = @selection.chunk.start.node.parentElement.innerHTML

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
				@deleteSelection @selection.chunk
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



