import React from 'react'
import { Node, Element, Transforms, Text } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import EditorComponent from './editor-component'
import Converter from './converter'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

const MCFeedback = {
	name: MCFEEDBACK_NODE,
	menuLabel: 'Multiple Choice Feedback',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCAnswer, only allow Content children
			if (Element.isElement(node) && node.type === MCFEEDBACK_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					if (!Common.Registry.contentTypes.includes(child.type)) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// Wrap loose text children in a Text Node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor, 
							{
								type: TEXT_NODE,
								content: { indent: 0 }
							},
							{ at: childPath }
						)
						return
					}
				}
			}

			next(entry, editor)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default MCFeedback
