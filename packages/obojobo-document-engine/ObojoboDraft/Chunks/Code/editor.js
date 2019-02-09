import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Line from './components/line/editor-component'
import Schema from './schema'
import Converter from './converter'

import deleteEmptyParent from '../../../src/scripts/common/chunk/util/delete-empty-parent'
import decreaseIndent from './changes/decrease-indent'
import increaseIndent from './changes/increase-indent'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const isType = change => {
	return change.value.blocks.some(block => {
		return !!change.value.document.getClosest(block.key, parent => {
			return parent.type === CODE_NODE
		})
	})
}

const plugins = {
	onKeyDown(event, change) {
		const isCode = isType(change)
		if (!isCode) return

		if (event.key === 'Backspace' || event.key === 'Delete') {
			return deleteEmptyParent(event, change, CODE_NODE)
		}

		// Shift Tab
		if (event.key === 'Tab' && event.shiftKey) {
			return decreaseIndent(event, change)
		}

		// Tab indent
		if (event.key === 'Tab') {
			increaseIndent(event, change)
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== CODE_LINE_NODE) return
		if (node.text !== '') return

		return (
			<span className={'placeholder'} contentEditable={false}>
				{'Type Your Code Here'}
			</span>
		)
	},
	renderNode(props) {
		switch (props.node.type) {
			case CODE_NODE:
				return <Node {...props} {...props.attributes} />
			case CODE_LINE_NODE:
				return <Line {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Code', {
	name: 'Code',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Code = {
	name: CODE_NODE,
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

export default Code
