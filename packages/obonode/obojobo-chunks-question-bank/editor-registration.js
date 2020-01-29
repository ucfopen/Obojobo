import React from 'react'
import { Node, Element, Transforms, Text } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Settings from './components/settings/editor-component'
import Converter from './converter'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const QuestionBank = {
	name: QUESTION_BANK_NODE,
	menuLabel: 'Question Bank',
	icon: Icon,
	isInsertable: true,
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

			// If the element is a Question, handle Content children
			if (Element.isElement(node) && node.type === QUESTION_BANK_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first child should always be a content node
					if(Element.isElement(child) && !(child.type === QUESTION_BANK_NODE || child.type === QUESTION_NODE)){
						Transforms.removeNodes(
							editor,
							{ at: childPath }
						)
						return
					}

					// Wrap loose text children in a Question
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor, 
							{
								type: QUESTION_NODE,
								content: { type: 'default' },
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
			switch (props.element.subtype) {
				case SETTINGS_NODE:
					return <Settings {...props} {...props.attributes} />
				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	},
	getPasteNode: questionbank => {
		// If passed a 'whole' questionbank, return the questionbank
		// A 'whole' question bank contains either more than 1 question, or a question(s) and the qb settings
		if (questionbank.nodes.size > 1) return questionbank

		// If the questionbank is not whole and the child is a question, get just the question
		// (or just the content nodes, if a whole question is not selected)
		const childNode = questionbank.nodes.get(0)
		if (childNode.type === QUESTION_NODE) {
			return Common.Registry.getItemForType(QUESTION_NODE).getPasteNode(childNode)
			// If the child is not a question, it is a settings node.
			// Extract just the plain text, and paste that
		} else {
			return childNode.nodes.map(parameter =>
				Block.create({
					object: 'block',
					type: TEXT_NODE,
					nodes: parameter.nodes.map(node => ({
						object: 'block',
						type: TEXT_LINE_NODE,
						nodes: [node.toJSON()]
					}))
				})
			)
		}
	}
}

export default QuestionBank
