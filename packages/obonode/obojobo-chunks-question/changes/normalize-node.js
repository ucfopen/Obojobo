import { Node, Element, Transforms, Text } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'

// Slate runs normalizations repeatedly on a single node, so each problem can be fixed separtely
// When the normalizeNode function returns, Slate knows that a single problem within the node
// has been fixed, and runs the normalizeNode function again to see if there are any further problems
// For more detailed information, see: https://docs.slatejs.org/concepts/10-normalizing
const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	return
	console.log('qnn')

	// If the element is a Question, handle Content children
	if (Element.isElement(node) && node.type === QUESTION_NODE && !node.subtype) {
		console.log('qn1')
		let index = 0
		let hasSolution = false
		let hasAssessment = false
		for (const [child, childPath] of Node.children(editor, path, { reverse: true })) {
			// the last index should either be a solution node or a MCAssessment
			if (index === 0 && Element.isElement(child)) {
				if (child.subtype === SOLUTION_NODE) {
					hasSolution = true
					index++
					continue
				} else if (child.type === MCASSESSMENT_NODE || child.type === NUMERIC_ASSESSMENT_NODE) {
					console.log('qn we good dawg')
					hasAssessment = true
					index++
					continue
				} else {
					console.log('qn2', child.type)
					// If the last index is not one of the two valid options
					// insert a MCAssessment and allow subsequent normalizations
					// to fill it
					Transforms.insertNodes(
						editor,
						{
							type: MCASSESSMENT_NODE,
							content: {
								responseType: 'pick-one',
								shuffle: true
							},
							questionType: node.content.type,
							children: [{ text: '' }]
						},
						{ at: path.concat(node.children.length) }
					)
					return
				}
			}

			if (
				index === 1 &&
				hasSolution &&
				(child.type === MCASSESSMENT_NODE || child.type === NUMERIC_ASSESSMENT_NODE)
			) {
				console.log('qn3')
				hasAssessment = true
				index++
				continue

				// If there is a solution but no MCAssessment, insert a MCAssessment
				// and allow subsequent normalizations to fill it
			} else if (
				index === 1 &&
				hasSolution &&
				child.type !== MCASSESSMENT_NODE &&
				child.type !== NUMERIC_ASSESSMENT_NODE
			) {
				console.log('qn4')
				Transforms.insertNodes(
					editor,
					{
						type: MCASSESSMENT_NODE,
						content: {
							responseType: 'pick-one',
							shuffle: true
						},
						questionType: 'default',
						children: [{ text: '' }]
					},
					{ at: path.concat(node.children.length - 1) }
				)
				return
			}

			// If we get here we have a MCAssessment node, and every subsequent node should be
			// a content node
			if (Element.isElement(child) && !Common.Registry.contentTypes.includes(child.type)) {
				console.log('qn5')
				Transforms.removeNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a Text node
			if (Text.isText(child)) {
				console.log('qn6')
				Transforms.wrapNodes(
					editor,
					{
						type: TEXT_NODE,
						content: {}
					},
					{ at: childPath }
				)
				return
			}

			index++
		}

		// If we only have a Solution, add a MCAssessment child
		if (hasSolution && node.children.length < 2) {
			console.log('qn7')
			Transforms.insertNodes(
				editor,
				{
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: MCASSESSMENT_NODE,
							content: {
								responseType: 'pick-one',
								shuffle: true
							},
							questionType: node.content.type,
							children: [{ text: '' }]
						}
					]
				},
				{ at: path.concat(0) }
			)
			return
		}

		// If we only have a Assessment & a Solution, add a text child
		if (hasSolution && hasAssessment && node.children.length < 3) {
			console.log('qn8')
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
				{ at: path.concat(0) }
			)
			return
		}

		// If we only have a MCAssessment add a text child
		if (!hasSolution && hasAssessment && node.children.length < 2) {
			console.log('qn9')
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
				{ at: path.concat(0) }
			)
			return
		}
	}

	// If the element is a Solution, make sure there is only one Page child
	if (Element.isElement(node) && node.subtype === SOLUTION_NODE) {
		console.log('qnA')
		let index = 0
		for (const [child, childPath] of Node.children(editor, path)) {
			if (index === 0 && child.type !== PAGE_NODE) {
				console.log('qnB')
				NormalizeUtil.wrapOrphanedSiblings(
					editor,
					[child, childPath],
					{
						type: PAGE_NODE,
						content: {},
						children: []
					},
					matchNode => !Common.Registry.contentTypes.includes(matchNode.type)
				)
				return
			}

			if (index > 0) {
				console.log('qnB')
				Transforms.removeNodes(editor, { at: childPath })
				return
			}

			index++
		}
	}

	next(entry, editor)
}

export default normalizeNode
