import { Node, Element, Transforms, Text, Editor, Range } from 'slate'
import Converter from './converter'
import React from 'react'
import NumericAssessmentComponent from './editor-component'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import emptyNode from './empty-node.json'
import { ReactEditor } from 'slate-react'

import { NUMERIC_ASSESSMENT_NODE, NUMERIC_ASSESSMENT_UNITS } from './constants'
import { CHOICE_NODE } from 'obojobo-chunks-abstract-assessment/constants'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const UNITS_NODE = 'ObojoboDraft.Chunks.NumericAssessment.Units'

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

			// If the element is a NumericAssessment, only allow NumericChoice or Units nodes
			if (
				Element.isElement(node) &&
				node.type === NUMERIC_ASSESSMENT_NODE &&
				node.subtype !== NUMERIC_ASSESSMENT_UNITS
			) {
				let index = 0
				const unitNodes = []
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a Units node.
					switch (index) {
						case 0:
							if (
								Element.isElement(child) &&
								child.type === NUMERIC_ASSESSMENT_NODE &&
								child.subtype === NUMERIC_ASSESSMENT_UNITS
							) {
								unitNodes.push([child, childPath])
								break
							} else {
								// Intentional fallthrough
							}

						//eslint-disable-next-line no-fallthrough
						default:
							// All other nodes should be Choice nodes
							// If it is not, wrapping it will result in normalizations to fix it
							if (Element.isElement(child) && child.type !== CHOICE_NODE) {
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

				if (unitNodes.length === 0) {
					Transforms.insertNodes(
						editor,
						{
							type: NUMERIC_ASSESSMENT_NODE,
							subtype: NUMERIC_ASSESSMENT_UNITS,
							content: {},
							children: [{ text: '' }]
						},
						{ at: path.concat(0) } //path?
					)
				} else if (unitNodes.length > 1) {
					unitNodes
						.slice(1)
						.reverse()
						.forEach(([, childPath]) => {
							Transforms.removeNodes(editor, childPath)
						})
				}

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

			next(entry, editor)
		},
		onKeyDown(entry, editor, event) {
			switch (event.key) {
				case 'Backspace':
					// Prevent backspacing at the beginning of the units node
					if (Range.isCollapsed(editor.selection) && editor.selection.anchor.offset === 0) {
						event.preventDefault()
					}
					return

				case 'Delete': {
					// The units node is the first child of a Numeric Assessment
					const [node] = entry
					const unitsNode = node.children[0]

					// Prevent forward delete when at the end of the unit node
					if (
						Range.isCollapsed(editor.selection) &&
						editor.selection.anchor.offset === Node.string(unitsNode).length
					) {
						event.preventDefault()
					}
					return
				}

				case 'Enter':
					// Prevent enter so the units node isn't split
					event.preventDefault()
					return

				case 'Tab':
					event.preventDefault()
					editor.insertText('\t')
					return

				case 'a': {
					// If doing cmd/ctrl+A then select the contents of the units node
					// instead of the whole document
					if (!event.ctrlKey && !event.metaKey) {
						return
					}

					event.preventDefault()

					// The units node is the first child of a Numeric Assessment
					const [node] = entry
					const unitsNode = node.children[0]

					// Select the contents of the unit node
					const path = ReactEditor.findPath(editor, unitsNode)
					const start = Editor.start(editor, path)
					const end = Editor.end(editor, path)
					Transforms.setSelection(editor, {
						focus: start,
						anchor: end
					})
				}
			}
		},
		renderNode(props) {
			switch (props.element.subtype) {
				case UNITS_NODE:
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
