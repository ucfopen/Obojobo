import React from 'react'
import { Node, Element, Transforms, Text } from 'slate'

import EditorComponent from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

const MCChoice = {
	name: MCCHOICE_NODE,
	menuLabel: 'Multiple Choice Choice',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCChoice, only allow 1 MCAnswer and 1 MCFeedback
			if (Element.isElement(node) && node.type === MCCHOICE_NODE) {
				let index = 0
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a MCAnswer
					// If it is not, wrapping it will result in normalizations to fix it
					if(index === 0 && Element.isElement(child) && child.type !== MCANSWER_NODE) {
						Transforms.wrapNodes(
							editor, 
							{
								type: MCANSWER_NODE,
								content: {}
							},
							{ at: childPath }
						)
						return
					}

					// The second node should be an (optional) MCFeedback
					// If it is not, remove it
					if (index === 1 && Element.isElement(child) && child.type !== MCFEEDBACK_NODE) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// A MCChoice should not ever have more than 2 nodes
					if(index > 1) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// Wrap loose text children in a MCAnswer Node
					// This will result in subsequent normalizations to wrap it in a text node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor, 
							{
								type: MCANSWER_NODE,
								content: {}
							},
							{ at: childPath }
						)
						return
					}

					index++
				}
			}

			next(entry, editor)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		},
		schema: Schema
	}
}

export default MCChoice
