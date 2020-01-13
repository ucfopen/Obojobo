import { getEventTransfer, ReactEditor } from 'slate-react'
import { Block, Editor, Path, Element, Transforms } from 'slate'

import Converter from './converter'
import Icon from './icon'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import Line from './components/line/editor-component'
import Node from './editor-component'
import React from 'react'
import Schema from './schema'
import decreaseIndent from './changes/decrease-indent'
import emptyNode from './empty-node.json'
import increaseIndent from './changes/increase-indent'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const plugins = {
	// onPaste(event, editor, next) {
	// 	const isCode = isType(editor)
	// 	const transfer = getEventTransfer(event)
	// 	if (transfer.type === 'fragment' || !isCode) return next()

	// 	const saveBlocks = editor.value.blocks

	// 	editor
	// 		.createCodeLinesFromText(transfer.text.split('\n'))
	// 		.forEach(line => editor.insertBlock(line))

	// 	saveBlocks.forEach(node => {
	// 		if (node.text === '') {
	// 			editor.removeNodeByKey(node.key)
	// 		}
	// 	})
	// },
	onKeyDown(node, editor, event) {
		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteEmptyParent(event, editor, node, event.key === 'Delete')

			case 'Tab':
				// TAB+SHIFT
				if (event.shiftKey) return decreaseIndent(node, editor, event)

				// TAB
				return increaseIndent(node, editor, event)
		}
	},
	renderNode(props) {
		switch (props.element.subtype) {
			case CODE_LINE_NODE:
				return <Line {...props} {...props.attributes} />
			default:
				return <Node {...props} {...props.attributes} />
		}
	},
}

const Code = {
	name: CODE_NODE,
	icon: Icon,
	menuLabel: 'Code',
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins
}

export default Code
