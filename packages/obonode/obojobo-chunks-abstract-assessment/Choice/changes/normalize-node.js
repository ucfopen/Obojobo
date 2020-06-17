import { Node, Element, Transforms, Text, Editor } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import { MC_ANSWER_NODE } from 'obojobo-chunks-multiple-choice-assessment/constants'

import { 
	CHOICE_NODE, 
	FEEDBACK_NODE, 
	validAnswers, 
	validAssessments, 
	assessmentToAnswer, 
	answerTypeToJson, 
	answerToAssessment 
} from '../../constants'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const getAnswer = (path, editor) => {
	// If the choice has an Assessment parent, pull from it's type to 
	// determine what kind of answer to insert
	const parent = Editor.above(editor, { at: path })
	if(parent && validAssessments.includes(parent[0].type)) {
		return assessmentToAnswer[parent[0].type]
	}

	// If the choice does not have an Assessment parent, see if its
	// sibling has an answers, and use their type if so.
	// We only need to check the sibling immediately after this 
	// node - if it does not have an answer there will be no subsequent
	// siblings, and any siblings before this choice would have caused
	// normalization to wrap choices in an assessment already
	// (ergo, this branch will only be run on the first Choice node
	// in a series)
	const sibling = Editor.next(editor, { at: path })
	if (sibling 
		&& sibling[0].type === CHOICE_NODE 
		&& sibling[0].children.length > 0
		&& validAnswers.includes(sibling[0].children[0].type)) {
		return answerTypeToJson[sibling[0].children[0].type]
	}

	// If the proper answer type cannot be determined, use a MCAnswer
	return {
		type: MC_ANSWER_NODE,
		content: {},
		children: [
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
			}
		]
	}
}

const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	// If the element is a Choice, only allow 1 Answer and 1 Feedback
	if (Element.isElement(node) && node.type === CHOICE_NODE) {
		let index = 0
		for (const [child, childPath] of Node.children(editor, path)) {
			// The first node should be an Answer
			if(index === 0 && Element.isElement(child) && !validAnswers.includes(child.type)) {
				// If the first child is a FEEDBACK, insert a Answer above it
				if(child.type === FEEDBACK_NODE) {
					return Transforms.insertNodes(
						editor,
						getAnswer(path, editor),
						{ at: childPath }
					)
				}

				// Otherwise, wrap the child in an Answer and let the answer
				// normalization decide what to do with it
				return Transforms.wrapNodes(
					editor,
					getAnswer(path, editor),
					{ at: childPath }
				)
			}

			// The second node should be an (optional) Feedback
			// If it is not, remove it
			if (index === 1 && Element.isElement(child) && child.type !== FEEDBACK_NODE) {
				Transforms.removeNodes(editor, { at: childPath })
				return
			}

			// A Choice should not ever have more than 2 nodes
			if(index > 1) {
				Transforms.removeNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in an Answer Node
			// This may result in subsequent normalizations depending on the answer
			if (Text.isText(child)) {
				return Transforms.wrapNodes(
					editor, 
					getAnswer(path, editor),
					{ at: childPath }
				)
			}

			index++
		}

		// Choice parent normalization
		// Note - collects up all Choice sibilngs, 
		// as well as any orphaned Feedback and Answer nodes
		// Matches the child Answer node to wrap - previous normalizations garuntee
		// that there is always an Answer node to match
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || !validAssessments.includes(parent.type)) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				answerToAssessment[node.children[0].type], 
				node => node.type === CHOICE_NODE || node.type === FEEDBACK_NODE || validAnswers.includes(node.type)
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode