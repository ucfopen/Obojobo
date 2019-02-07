import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Line from './components/line/editor-component'
import Schema from './schema'
import Converter from './converter'

import deleteEmptyParent from './changes/delete-empty-parent'
import splitParent from './changes/split-parent'
import decreaseIndent from './changes/decrease-indent'
import increaseIndent from './changes/increase-indent'
import insertTab from './changes/insert-tab'

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
	onKeyDown(event, editor, next) {
		const isText = isType(editor)
		if (!isText) return next()

		// Delete empty text node
		if (event.key === 'Backspace' || event.key === 'Delete') {
			return deleteEmptyParent(event, editor)
		}

		// Enter
		if (event.key === 'Enter') {
			const last = editor.value.endBlock
			if (last.text !== '') return

			// Double Enter
			return splitParent(event, editor)
		}

		// Shift+Tab
		if (event.key === 'Tab' && event.shiftKey) {
			return decreaseIndent(event, editor)
		}

		// Alt+Tab
		if (event.key === 'Tab' && event.altKey) {
			return increaseIndent(event, editor)
		}

		// Tab
		if (event.key === 'Tab') {
			return insertTab(event, editor)
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
		if (node.object !== 'block' || node.type !== TEXT_LINE_NODE) return next()
		if (node.text !== '') return next()

		return (
			<span className={'placeholder align-' + node.data.get('align')} contentEditable={false}>
				{'Type Your Text Here'}
			</span>
		)
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Text', {
	name: 'Text',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Text = {
	name: TEXT_NODE,
	components: {
		Node,
		Line,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default Text
