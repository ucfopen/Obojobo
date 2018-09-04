TOOLBAR_BOLD = require 'svg-url?noquotes!./assets/bold.svg'
TOOLBAR_ITALIC = require 'svg-url?noquotes!./assets/italic.svg'
TOOLBAR_INDENT = require 'svg-url?noquotes!./assets/indent.svg'
TOOLBAR_INSERT = require 'svg-url?noquotes!./assets/insert.svg'
TOOLBAR_UNINDENT = require 'svg-url?noquotes!./assets/unindent.svg'
TOOLBAR_SUB = require 'svg-url?noquotes!./assets/sub.svg'
TOOLBAR_SUP = require 'svg-url?noquotes!./assets/sup.svg'
TOOLBAR_LINK = require 'svg-url?noquotes!./assets/link.svg'

OBO = window.OBO

Common = window.ObojoboDraft.Common
StyleType = Common.text.StyleType
ChunkUtil = Common.chunk.util.ChunkUtil
Chunk = Common.models.Chunk

OBO
	.registerToolbarItem
		id: 'boldText'
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

	.registerToolbarItem
		id: 'italicText'
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

	.registerToolbarItem
		id: 'link'
		type: 'toggle'
		label: 'Link'
		icon: TOOLBAR_LINK
		state: 'off'
		onClick: (toolbarItem, editorState, selection) ->
			url = prompt 'url?'
			ChunkUtil.activateStyle StyleType.LINK, selection, editorState.styleBrush, { href:url }
		onSelectionUpdate: (toolbarItem, editorState, selection) ->
			brushState = editorState.styleBrush.getStyleState(StyleType.LINK)
			state = brushState is 'apply' or (brushState isnt 'remove' and selection.styles[StyleType.LINK])
			toolbarItem.state = if state then 'on' else 'off'

	.registerToolbarItem
		id: 'unindent'
		type: 'button'
		label: 'Unindent'
		icon: TOOLBAR_UNINDENT
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'indent', selection.virtual.all, selection, [true]

	.registerToolbarItem
		id: 'indent'
		type: 'button'
		label: 'Indent'
		icon: TOOLBAR_INDENT
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'indent', selection.virtual.all, selection, [false]

	.registerToolbarItem
		id: 'subscriptText'
		type: 'button'
		label: 'Subscript Text'
		icon: TOOLBAR_SUB
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'styleSelection', selection.virtual.all, selection, [StyleType.SUPERSCRIPT, -1]

	.registerToolbarItem
		id: 'superscriptText'
		type: 'button'
		label: 'Superscript Text'
		icon: TOOLBAR_SUP
		onClick: (toolbarItem, editorState, selection) ->
			ChunkUtil.send 'styleSelection', selection.virtual.all, selection, [StyleType.SUPERSCRIPT, 1]