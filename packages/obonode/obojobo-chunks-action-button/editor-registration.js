import React from 'react'
import { Element, Node, Transforms } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import NodeElement from './editor-component'
import Converter from './converter'

const UNIQUE_NAME = 'ObojoboDraft.Chunks.ActionButton'

const ActionButton = {
	name: UNIQUE_NAME,
	menuLabel: 'Button',
	icon: Icon,
	isInsertable: true,
	components: {
		NodeElement,
		Icon
	},
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props) {
			return <NodeElement {...props} {...props.attributes} />
		},
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is an Action Button, only allow Text children
			if (Element.isElement(node) && node.type === UNIQUE_NAME) {
				for (const [child, childPath] of Node.children(editor, path)) {
					if (Element.isElement(child)) {
						Transforms.unwrapNodes(editor, { at: childPath })
						return
					}
				}
			}

			next(entry, editor)
		}
	}
}

export default ActionButton
