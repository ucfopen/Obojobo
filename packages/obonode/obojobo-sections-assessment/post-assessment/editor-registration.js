import React from 'react'
import { Editor, Node, Element, Transforms } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import PostAssessment from './editor-component'
import Converter from './converter'
import PostAssessmentScore from './post-assessment-score'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const plugins = {
	normalizeNode(entry, editor, next) {
		const [node, path] = entry

		// If the element is a Actions Node, make sure it has Score children
		if (node.type === ACTIONS_NODE && !node.subtype) {
			for (const [child, childPath] of Node.children(editor, path)) {
				// Wrap non-Score childen in a score node
				if (child.subtype !== SCORE_NODE) {
					Transforms.wrapNodes(
						editor,
						{
							type: ACTIONS_NODE,
							subtype: SCORE_NODE,
							content: { for: '[0,100]' }
						},
						{ at: childPath }
					)
					return
				}
			}

			// Actions parent normalization
			const [parent] = Editor.parent(editor, path)
			if (!Element.isElement(parent) || parent.type !== ASSESSMENT_NODE) {
				Transforms.unwrapNodes(editor, { at: path })
				return
			}
		}

		// If the element is a Score Node, make sure it has a single Page child
		if (node.type === ACTIONS_NODE && node.subtype === SCORE_NODE) {
			let index = 0
			for (const [child, childPath] of Node.children(editor, path)) {
				// Unwrap non-text children
				if (index === 0 && child.type !== PAGE_NODE) {
					NormalizeUtil.wrapOrphanedSiblings(
						editor,
						[child, childPath],
						{ type: PAGE_NODE, content: {}, children: [] },
						node => node
					)
					return
				}

				if (index > 0) {
					Transforms.removeNodes(editor, { at: childPath })
					return
				}

				index++
			}

			// Score parent normalization - if parent is not Actions unwrap the Score children
			const [parent] = Editor.parent(editor, path)
			if (!Element.isElement(parent) || parent.type !== ACTIONS_NODE) {
				Transforms.unwrapNodes(editor, { at: path.concat(0) })
				Transforms.unwrapNodes(editor, { at: path })
				return
			}
		}

		next(entry, editor)
	},
	renderNode(props) {
		switch (props.element.subtype) {
			case SCORE_NODE:
				return <PostAssessmentScore {...props} {...props.attributes} />
			default:
				return <PostAssessment {...props} {...props.attributes} />
		}
	}
}

const Actions = {
	name: ACTIONS_NODE,
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins
}

export default Actions
