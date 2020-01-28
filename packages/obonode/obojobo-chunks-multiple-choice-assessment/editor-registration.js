import React from 'react'
import { Node, Element, Transforms, Text } from 'slate'

import EditorComponent from './editor-component'
import Converter from './converter'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const MCAssessment = {
	name: 'ObojoboDraft.Chunks.MCAssessment',
	menuLabel: 'Multiple Choice Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCAssessment, only allow MCChoice nodes
			if (Element.isElement(node) && node.type === MCASSESSMENT_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a MCAnswer
					// If it is not, wrapping it will result in normalizations to fix it
					if(Element.isElement(child) && child.type !== MCCHOICE_NODE) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// Wrap loose text children in a MCAnswer Node
					// This will result in subsequent normalizations to wrap it in a text node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor, 
							{
								type: MCCHOICE_NODE,
								content: { score: 0 }
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

export default MCAssessment
