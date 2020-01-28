import React from 'react'
import { Node, Element, Transforms, Text, Editor } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Solution from './components/solution/editor-component'
import Converter from './converter'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const Question = {
	name: QUESTION_NODE,
	menuLabel: 'Question',
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

			// If the element is a MCAnswer, only allow Content children
			if (Element.isElement(node) && node.type === QUESTION_NODE) {
				let index = 0
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first child should always be a content node
					if(index === 0 && Element.isElement(child) && !Common.Registry.contentTypes.includes(child.type)){
						Transforms.insertNodes(
							editor,
							{
								type: TEXT_NODE,
								content: {},
								children: [
									{
										type: TEXT_NODE,
										subtype: TEXT_LINE_NODE,
										content: { indent: 0 },
										children: [{ text: '' }]
									}
								]
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
			switch (props.element.subtype) {
				case SOLUTION_NODE:
					return <Solution {...props} {...props.attributes} />
				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	},
	getNavItem(model) {
		const questions = model.parent.children.models.filter(
			child => child.get('type') === QUESTION_NODE
		)
		const label = model.title || `Question ${questions.indexOf(model) + 1}`

		return {
			type: 'sub-link',
			label,
			path: [`#obo-${model.get('id')}`]
		}
	},
	// getPasteNode(question) {
	// 	// If passed a 'whole' question return the question
	// 	// 'Whole' questions are defined as questions that contain more than one child
	// 	// and at least one child is a MCAssessment
	// 	// (Ex: the user selected on node in the question body and one node in an MCAssessment)
	// 	const mcAssess = question.nodes.filter(node => node.type === MCASSESSMENT_NODE).get(0)
	// 	if (mcAssess && question.nodes.size > 1) return question

	// 	// If the question is not whole, get the content nodes
	// 	// get the index of the mc assessment
	// 	const nodes = []

	// 	// Get all the content nodes in the question body
	// 	for (const node of question.nodes) {
	// 		if (node.type === MCASSESSMENT_NODE || node.type === SOLUTION_NODE) break

	// 		nodes.push(node)
	// 	}

	// 	// Extract out the content nodes in the MCAssessment
	// 	if (mcAssess) {
	// 		mcAssess.nodes.forEach(choiceListOrSettings => {
	// 			if (choiceListOrSettings.type === CHOICE_LIST_NODE) {
	// 				choiceListOrSettings.nodes.forEach(mcChoice => {
	// 					mcChoice.nodes.forEach(ansOrFeedback => {
	// 						ansOrFeedback.nodes.forEach(contentNode => nodes.push(contentNode))
	// 					})
	// 				})
	// 			}
	// 		})
	// 	}

	// 	// Extract out the content nodes in the Solution
	// 	const solution = question.nodes.filter(node => node.type === SOLUTION_NODE).get(0)
	// 	if (solution) {
	// 		solution.nodes.forEach(page => {
	// 			page.nodes.forEach(contentNode => nodes.push(contentNode))
	// 		})
	// 	}

	// 	return nodes
	// }
}

export default Question
