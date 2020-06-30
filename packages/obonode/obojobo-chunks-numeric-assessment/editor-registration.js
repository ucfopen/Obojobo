import { Node, Element, Transforms, Text, Editor } from 'slate'
import Converter from './converter'
import React from 'react'
import NumericAssessmentComponent from './editor-component'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import emptyNode from './empty-node.json'

import { NUMERIC_ASSESSMENT_NODE } from './constants'
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

			// If the element is a NumericAssessment, only allow NumericChoice nodes
			if (Element.isElement(node) && node.type === NUMERIC_ASSESSMENT_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a Choice
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
		renderNode(props) {
			return <NumericAssessmentComponent {...props} {...props.attributes} />
		}
	}
}

export default NumericAssessment
