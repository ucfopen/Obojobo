import { Node, Element, Transforms, Text, Editor } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const CHOICE_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Choice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const FEEDBACK_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Feedback'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	return next(entry, editor)

	// If the element is a MCChoice, only allow 1 MCAnswer and 1 MCFeedback
	if (Element.isElement(node) && node.type === CHOICE_NODE) {
		let index = 0
		for (const [child, childPath] of Node.children(editor, path)) {
			// The first node should be an Answer
			if(index === 0 && Element.isElement(child) && child.type !== MCANSWER_NODE) {
				// If the first child is a FEEDBACK, insert a Answer above it
				if(child.type === FEEDBACK_NODE) {
					Transforms.insertNodes(
						editor,
						{
							type: MCANSWER_NODE,
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
						},
						{ at: childPath }
					)
					return
				}

				// Otherwise, wrap the child in a MCAnswer and let MCAnswer
				// normalization decide what to do with it
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

		// Choice parent normalization
		// Note - collects up all Choice sibilngs, 
		// as well as any orphaned Feedback and Answer nodes
		// Matches the child Answer node to wrap
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || parent.type !== MCASSESSMENT_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				{ 
					type: MCASSESSMENT_NODE, 
					content: {
						responseType: 'pick-one',
						shuffle: false
					},
					questionType: 'default',
					children: []
				}, 
				node => node.type === CHOICE_NODE || node.type === FEEDBACK_NODE || node.type.includes('Answer')
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode