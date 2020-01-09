import { getEventTransfer } from 'slate-react'
import { Block } from 'slate'

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
import insertTab from './changes/insert-tab'
import splitParent from './changes/split-parent'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const isType = editor => {
	return editor.value.blocks.some(block => {
		return !!editor.value.document.getClosest(block.key, parent => {
			return parent.type === TEXT_NODE
		})
	})
}

const plugins = {
	onPaste(event, editor, next) {
		const isList = isType(editor)
		const transfer = getEventTransfer(event)
		if (transfer.type === 'fragment' || !isList) return next()

		const saveBlocks = editor.value.blocks

		editor
			.createTextLinesFromText(transfer.text.split('\n'))
			.forEach(line => editor.insertBlock(line))

		saveBlocks.forEach(node => {
			if (node.text === '') {
				editor.removeNodeByKey(node.key)
			}
		})
	},
	onKeyDown(event, editor, next) {
		const isText = isType(editor)
		if (!isText) return next()

		const last = editor.value.endBlock

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteEmptyParent(event, editor, next, TEXT_NODE)

			case 'Enter':
				// Single Enter
				if (last.text !== '') return next()

				// Double Enter
				return splitParent(event, editor, next)

			case 'Tab':
				// TAB+SHIFT
				if (event.shiftKey) return decreaseIndent(event, editor, next)

				// TAB+ALT
				if (event.altKey) return increaseIndent(event, editor, next)

				// TAB
				return insertTab(event, editor, next)

			default:
				return next()
		}
	},
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case TEXT_NODE:
				return <Node {...props} {...props.attributes} />
			case TEXT_LINE_NODE:
				return <Line {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	renderPlaceholder(props, editor, next) {
		const { node } = props
		if (node.object !== 'block' || node.type !== TEXT_LINE_NODE || node.text !== '') return next()

		return (
			<span
				className={'placeholder align-' + node.data.get('align')}
				contentEditable={false}
				data-placeholder="Type Your Text Here"
			/>
		)
	},
	schema: Schema,
	queries: {
		createTextLinesFromText(editor, textList) {
			return textList.map(textLine =>
				Block.create({
					object: 'block',
					type: TEXT_LINE_NODE,
					data: {},
					nodes: [
						{
							object: 'text',
							leaves: [{ object: 'leaf', text: textLine, marks: [] }]
						}
					]
				})
			)
		}
	}
}

const Text = {
	name: TEXT_NODE,
	menuLabel: 'Text',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins
}

export default Text
