import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case HTML_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	onKeyDown(event, editor, next) {
		const isHTML = editor.value.blocks.some(block => block.type === HTML_NODE)
		if (!isHTML) return next()

		switch (event.key) {
			// Insert a softbreak on enter
			case 'Enter':
				event.preventDefault()
				return editor.insertText('\n')

			case 'Tab':
				event.preventDefault()
				return editor.insertText('\t')

			default:
				return next()
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.HTML', {
	name: 'HTML',
	icon: Icon,
	isInsertable: true,
	templateObject: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const HTML = {
	name: HTML_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default HTML
