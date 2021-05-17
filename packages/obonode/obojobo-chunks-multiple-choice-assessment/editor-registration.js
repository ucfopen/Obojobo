import React from 'react'
import { Node, Element, Transforms, Text, Editor } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import emptyNode from './empty-node.json'
import EditorComponent from './editor-component'
import Converter from './converter'

import { CHOICE_NODE } from 'obojobo-chunks-abstract-assessment/constants'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'

const MCAssessment = {
	name: 'ObojoboDraft.Chunks.MCAssessment',
	menuLabel: 'Multiple Choice Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCAssessment, only allow MCChoice nodes
			if (Element.isElement(node) && node.type === MCASSESSMENT_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a MCChoice
					// If it is not, wrapping it will result in normalizations to fix it
					if (Element.isElement(child) && child.type !== CHOICE_NODE) {
						Transforms.wrapNodes(
							editor,
							{
								type: CHOICE_NODE,
								content: { score: 0 }
							},
							{ at: childPath }
						)
						return
					}

					// Wrap loose text children in a MCAnswer Node
					// This will result in subsequent normalizations to wrap it in a text node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor,
							{
								type: CHOICE_NODE,
								content: { score: 0 }
							},
							{ at: childPath }
						)
						return
					}
				}

				// MCA parent normalization
				// Note - Wraps an adjacent Solution node as well
				const [parent] = Editor.parent(editor, path)
				if (!Element.isElement(parent) || parent.type !== QUESTION_NODE) {
					NormalizeUtil.wrapOrphanedSiblings(
						editor,
						entry,
						{
							type: QUESTION_NODE,
							content: {
								type: node.questionType
							},
							children: []
						},
						() => node.type === SOLUTION_NODE
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

export default MCAssessment
