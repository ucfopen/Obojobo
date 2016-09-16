TOOLBAR_BOLD = require 'svg-url?noquotes!./assets/bold.svg'
TOOLBAR_ITALIC = require 'svg-url?noquotes!./assets/italic.svg'
TOOLBAR_INDENT = require 'svg-url?noquotes!./assets/indent.svg'
TOOLBAR_INSERT = require 'svg-url?noquotes!./assets/insert.svg'
TOOLBAR_UNINDENT = require 'svg-url?noquotes!./assets/unindent.svg'

OBO = window.OBO

ObojoboDraft = window.ObojoboDraft
StyleType = ObojoboDraft.text.StyleType
ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil
Chunk = ObojoboDraft.models.Chunk

OBO
	.addToolbarItem
		type: 'toggle'
		label: 'Bold text'
		icon: TOOLBAR_BOLD
		state: 'off'
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.activateStyle StyleType.BOLD, selection, editorState.styleBrush
		onSelectionUpdate: (toolbarItem, editorState, selection) ->
			boldBrushState = editorState.styleBrush.getStyleState(StyleType.BOLD)
			boldState = boldBrushState is 'apply' or (boldBrushState isnt 'remove' and selection.styles[StyleType.BOLD])
			toolbarItem.state = if boldState then 'on' else 'off'

	.addToolbarItem
		type: 'toggle'
		label: 'Italicize text'
		icon: TOOLBAR_ITALIC
		state: 'off'
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.activateStyle StyleType.ITALIC, selection, editorState.styleBrush
		onSelectionUpdate: (toolbarItem, editorState, selection) ->
			italicBrushState = editorState.styleBrush.getStyleState(StyleType.ITALIC)
			italicState = italicBrushState is 'apply' or (italicBrushState isnt 'remove' and selection.styles[StyleType.ITALIC])
			toolbarItem.state = if italicState then 'on' else 'off'

	.addToolbarItem
		type: 'separator'

	.addToolbarItem
		type: 'button'
		label: 'Unindent'
		icon: TOOLBAR_UNINDENT
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'indent', selection.virtual.all, selection, [true]

	.addToolbarItem
		type: 'button'
		label: 'Indent'
		icon: TOOLBAR_INDENT
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'indent', selection.virtual.all, selection, [false]

	.addToolbarItem
		type: 'separator'