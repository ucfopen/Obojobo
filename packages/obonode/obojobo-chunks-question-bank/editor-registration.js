import React from 'react'
import { Node, Element, Transforms, Text } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'

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
			return <EditorComponent {...props} {...props.attributes} />
		}
	},
}

export default QuestionBank
