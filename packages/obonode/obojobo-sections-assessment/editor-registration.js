import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { getEventTransfer } from 'slate-react'
import { Document, Block } from 'slate'

const UNIQUE_NAME = 'ObojoboDraft.Sections.Assessment'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'

import Node from './editor-component'
import Settings from './components/settings/editor-component'
import Converter from './converter'
import Schema from './schema'

const Assessment = {
	name: UNIQUE_NAME,
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	getNavItem(model) {
		const title = model.title || 'Assessment'
		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		}
	},
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case UNIQUE_NAME:
					return <Node {...props} {...props.attributes} />
				case SETTINGS_NODE:
					return <Settings {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	},
	getPasteNode(assessment){
		// If we are pasting an Assessment node, strip out all assessment specific structure
		const nodes = []

		// If there is a page, extract the nodes out of it
		const page = assessment.nodes.filter(node => node.type === PAGE_NODE).get(0)
		if(page) page.nodes.forEach(node => nodes.push(node))

		// If there is a questionbank, get the whole bank or the content
		const qb = assessment.nodes.filter(node => node.type === QUESTION_BANK_NODE).get(0)
		if(qb) {
			const pastableQB = Common.Registry.getItemForType(QUESTION_BANK_NODE).getPasteNode(qb)

			// Pasting from a question bank may give either a question bank, a question, or a list of nodes
			if(pastableQB instanceof Block){
				nodes.push(pastableQB)
			} else {
				pastableQB.forEach(node => nodes.push(node))
			}
		}

		// If there is a ScoreActions node, extract the nodes from their pages
		const scoreActions = assessment.nodes.filter(node => node.type === ACTIONS_NODE).get(0)
		if(scoreActions) {
			scoreActions.nodes.forEach(action => {
				const scorePage = action.nodes.get(0)
				scorePage.nodes.forEach(node => nodes.push(node))
			})
		}

		return nodes
	}
}

export default Assessment
