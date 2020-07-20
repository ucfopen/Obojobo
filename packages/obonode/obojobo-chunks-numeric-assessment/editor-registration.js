import { Node, Element, Transforms, Text, Editor } from 'slate'
import Converter from './converter'
import React from 'react'
import NumericAssessmentComponent from './editor-component'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import emptyNode from './empty-node.json'

import { NUMERIC_ASSESSMENT_NODE, NUMERIC_ASSESSMENT_UNITS } from './constants'
import { CHOICE_NODE } from 'obojobo-chunks-abstract-assessment/constants'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

const NumericAssessment = {
	name: 'ObojoboDraft.Chunks.NumericAssessment',
	menuLabel: 'Numeric Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			console.log('BEGIN NORMAL', node)

			// If the element is a NumericAssessment, only allow NumericChoice or Units nodes
			if (
				Element.isElement(node) &&
				node.type === NUMERIC_ASSESSMENT_NODE &&
				node.subtype !== NUMERIC_ASSESSMENT_UNITS
			) {
				let index = 0
				let hasUnitsNode = false
				for (const [child, childPath] of Node.children(editor, path)) {
					// continue
					// The first node should be a Units node.
					switch (index) {
						case 0:
							if (
								Element.isElement(child) &&
								child.type === NUMERIC_ASSESSMENT_NODE &&
								child.subtype === NUMERIC_ASSESSMENT_UNITS
							) {
								hasUnitsNode = true
								break
							} else {
								// Intentional fallthrough
							}

						//eslint-disable-next-line no-fallthrough
						default:
							// All other nodes should be Choice nodes
							// If it is not, wrapping it will result in normalizations to fix it
							if (Element.isElement(child) && child.type !== CHOICE_NODE) {
								console.log('FIXING', child, 'TO BE A CHOICE')
								Transforms.wrapNodes(
									editor,
									{
										type: CHOICE_NODE,
										content: { score: 100 }
									},
									{ at: childPath }
								)
								return
							}

							// Wrap loose text children in a NumericChoice Node
							// This will result in subsequent normalizations to wrap it in a text node
							if (Text.isText(child)) {
								console.log('FIXING LOOSE TEXT', child)
								Transforms.wrapNodes(
									editor,
									{
										type: CHOICE_NODE,
										content: { score: 100 }
									},
									{ at: childPath }
								)
								return
							}
							break
					}

					index++
				}

				//////////////
				if (!hasUnitsNode) {
					console.log('ADDING IN A UNITS NODE!', path)
					Transforms.insertNodes(
						editor,
						{
							type: NUMERIC_ASSESSMENT_NODE,
							subtype: NUMERIC_ASSESSMENT_UNITS,
							content: {},
							children: [{ text: 'normalized' }]
						},
						{ at: path.concat(0) } //path?
					)
				}
				///////////////
				console.log('hasUnitsNode', hasUnitsNode)

				// NumericAssessment parent normalization
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

			console.log('FIN', node)

			next(entry, editor)
		},
		onKeyDown(entry, editor, event) {
			console.log('onkeydown', entry, event.key)
			switch (event.key) {
				case 'Backspace':
				case 'Delete':
					console.log('okd', editor.selection)
					// event.preventDefault()
					// KeyDownUtil.isDeepEmpty(editor, )
					return
				// 	return KeyDownUtil.deleteEmptyParent(event, editor, entry, event.key === 'Delete')

				case 'Enter':
					// case 'Tab':
					// case 'h'
					event.preventDefault()
					return

				// case 'Tab':
				// 	// TAB+SHIFT
				// 	if (event.shiftKey) return decreaseIndent(entry, editor, event)

				// 	// TAB+ALT
				// 	if (event.altKey) return increaseIndent(entry, editor, event)

				// 	// TAB
				// 	return indentOrTab(entry, editor, event)

				// case 'h':
				// 	if (event.ctrlKey || event.metaKey) return toggleHangingIndent(entry, editor, event)
			}
		},
		renderNode(props) {
			console.log('render node', props)

			switch (props.element.subtype) {
				case 'ObojoboDraft.Chunks.NumericAssessment.Units':
					return (
						<div contentEditable={false} className="units-container">
							<span className="label">Units Text:</span>
							<span
								className="text units-input"
								contentEditable={true}
								suppressContentEditableWarning
							>
								{props.children}
							</span>
						</div>
					)
				default:
					return <NumericAssessmentComponent {...props} {...props.attributes} />
			}
		}
	}
}

export default NumericAssessment
