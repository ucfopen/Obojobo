Editor = window.Editor
Assets = Editor.assets

ObojoboDraft = window.ObojoboDraft
StyleType = ObojoboDraft.text.StyleType
ChunkUtil = ObojoboDraft.page.ChunkUtil
Chunk = ObojoboDraft.models.Chunk

console.log '@TODO - assumes heading is installed'

OBO
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