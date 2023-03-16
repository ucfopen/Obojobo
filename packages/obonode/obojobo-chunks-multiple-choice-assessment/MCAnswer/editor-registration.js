import React from 'react'
import { Node, Element, Transforms, Text, Editor } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import EditorComponent from './editor-component'
import Converter from './converter'

import { MC_ANSWER_NODE } from '../constants'
import { CHOICE_NODE, FEEDBACK_NODE } from 'obojobo-chunks-abstract-assessment/constants'

const disallowedChildren = ['ObojoboDraft.Chunks.Question', 'ObojoboDraft.Chunks.QuestionBank']

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const MCAnswer = {
	name: MC_ANSWER_NODE,
	menuLabel: 'Multiple Choice Answer',
	isInsertable: false,
	supportsChildren: true,
	disallowedChildren: disallowedChildren,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCAnswer, only allow Content children
			if (Element.isElement(node) && node.type === MC_ANSWER_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					if (Element.isElement(child) && !Common.Registry.contentTypes.includes(child.type)) {
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

				// MCAnswer parent normalization
				// Note - collect up an adjacent Feedback, if it exists
				const [parent] = Editor.parent(editor, path)
				if (!Element.isElement(parent) || parent.type !== CHOICE_NODE) {
					NormalizeUtil.wrapOrphanedSiblings(
						editor,
						entry,
						{
							type: CHOICE_NODE,
							content: { score: 0 },
							children: []
						},
						node => node.type === FEEDBACK_NODE
					)
					return
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

export default MCAnswer
