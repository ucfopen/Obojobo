Editor = window.Editor
Assets = Editor.assets

ObojoboDraft = window.ObojoboDraft
StyleType = ObojoboDraft.text.StyleType
ChunkUtil = ObojoboDraft.page.ChunkUtil
Chunk = ObojoboDraft.models.Chunk

OBO
	.addToolbarItem
		type: 'select'
		label: 'Change text type'
		selectedOption: 'Heading 1'
		options: [
			'Heading 1',
			'Heading 2',
			'Normal Text'
		]
		onClick: (toolbarItem, editorState) ->
			switch toolbarItem.selectedOption
				when 'Heading 1'
					newChunk = Chunk.create 'ObojoboDraft.Chunks.Heading'
					newChunk.componentContent.headingLevel = 1
				when 'Heading 2'
					newChunk = Chunk.create 'ObojoboDraft.Chunks.Heading'
					newChunk.componentContent.headingLevel = 2
				when 'Normal Text'
					newChunk = Chunk.create 'ObojoboDraft.Chunks.SingleText'

			newChunk.transformSelection editorState.selection
		onSelectionUpdate: (toolbarItem, editorState) ->
			if editorState.selection.chunk?.start?.chunk?
				type = editorState.selection.chunk.start.chunk.get('type')
				headingLevel = 0
				if type is 'ObojoboDraft.Chunks.Heading'
					headingLevel = editorState.selection.chunk.start.chunk.componentContent.headingLevel

				for chunk in editorState.selection.chunk.all
					if chunk.get('type') isnt type
						type = null
						break
					else if type is 'ObojoboDraft.Chunks.Heading' and chunk.componentContent.headingLevel isnt headingLevel
						type = null
						break

				if type?
					switch type + headingLevel
						when 'ObojoboDraft.Chunks.Heading1'
							toolbarItem.selectedOption = 'Heading 1'
						when 'ObojoboDraft.Chunks.Heading2'
							toolbarItem.selectedOption = 'Heading 2'
						else
							toolbarItem.selectedOption = 'Normal Text'
				else
					toolbarItem.selectedOption = null

	.addToolbarItem
		type: 'separator'

	.addToolbarItem
		type: 'toggle'
		label: 'Bold text'
		icon: Assets.TOOLBAR_BOLD
		state: 'off'
		onClick: (toolbarItem, editorState) ->
			ChunkUtil.activateStyle StyleType.BOLD, editorState.selection, editorState.styleBrush
		onSelectionUpdate: (toolbarItem, editorState) ->
			boldBrushState = editorState.styleBrush.getStyleState(StyleType.BOLD)
			boldState = boldBrushState is 'apply' or (boldBrushState isnt 'remove' and editorState.selection.styles[StyleType.BOLD])
			toolbarItem.state = if boldState then 'on' else 'off'

	.addToolbarItem
		type: 'toggle'
		label: 'Italicize text'
		icon: Assets.TOOLBAR_ITALIC
		state: 'off'
		onClick: (toolbarItem, editorState) ->
			ChunkUtil.activateStyle StyleType.ITALIC, editorState.selection, editorState.styleBrush
		onSelectionUpdate: (toolbarItem, editorState) ->
			italicBrushState = editorState.styleBrush.getStyleState(StyleType.ITALIC)
			italicState = italicBrushState is 'apply' or (italicBrushState isnt 'remove' and editorState.selection.styles[StyleType.ITALIC])
			toolbarItem.state = if italicState then 'on' else 'off'

	.addToolbarItem
		type: 'separator'

	.addToolbarItem
		type: 'button'
		label: 'Unindent'
		icon: Assets.TOOLBAR_UNINDENT
		onClick: (toolbarItem, editorState) ->
			ChunkUtil.send 'indent', editorState.selection.chunk.all, editorState.selection, [true]

	.addToolbarItem
		type: 'button'
		label: 'Indent'
		icon: Assets.TOOLBAR_INDENT
		onClick: (toolbarItem, editorState) ->
			ChunkUtil.send 'indent', editorState.selection.chunk.all, editorState.selection, [false]

	.addToolbarItem
		type: 'separator'

	.addToolbarItem
		type: 'button'
		label: '_test'
		icon: Assets.TOOLBAR_ITALIC
		onClick: (toolbarItem, editorState) ->
			console.clear()
			console.log '_test'
			# editorState.selection.chunk.start.chunk.styleSelection editorState.selection, 'q', { zeroLength:true }
			editorState.selection.chunk.start.chunk.insertText editorState.selection, '*'
			editorState.selection.chunk.end.offset++
			editorState.selection.chunk.start.chunk.styleSelection editorState.selection, 'q', { deleteMeZeroLength:true }