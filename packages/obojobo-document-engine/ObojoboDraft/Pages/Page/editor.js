import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import ActionButton from '../../Chunks/ActionButton/editor'
import Break from '../../Chunks/Break/editor'
import Code from '../../Chunks/Code/editor'
import Figure from '../../Chunks/Figure/editor'
import Heading from '../../Chunks/Heading/editor'
import IFrame from '../../Chunks/IFrame/editor'
import List from '../../Chunks/List/editor'
import MathEquation from '../../Chunks/MathEquation/editor'
import Table from '../../Chunks/Table/editor'
import Text from '../../Chunks/Text/editor'
import YouTube from '../../Chunks/YouTube/editor'
import QuestionBank from '../../Chunks/QuestionBank/editor'
import Question from '../../Chunks/Question/editor'
import MCAssessment from '../../Chunks/MCAssessment/editor'
import MCChoice from '../../Chunks/MCAssessment/MCChoice/editor'
import MCAnswer from '../../Chunks/MCAssessment/MCAnswer/editor'
import MCFeedback from '../../Chunks/MCAssessment/MCFeedback/editor'
import DefaultNode from '../../../src/scripts/oboeditor/components/default-node'
import Component from '../../../src/scripts/oboeditor/components/editor-component'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const nodes = {
	'ObojoboDraft.Chunks.ActionButton': ActionButton,
	'ObojoboDraft.Chunks.Break': Break,
	'ObojoboDraft.Chunks.Code': Code,
	'ObojoboDraft.Chunks.Figure': Figure,
	'ObojoboDraft.Chunks.Heading': Heading,
	'ObojoboDraft.Chunks.IFrame': IFrame,
	'ObojoboDraft.Chunks.List': List,
	'ObojoboDraft.Chunks.MathEquation': MathEquation,
	'ObojoboDraft.Chunks.Table': Table,
	'ObojoboDraft.Chunks.Text': Text,
	'ObojoboDraft.Chunks.YouTube': YouTube,
	'ObojoboDraft.Chunks.QuestionBank': QuestionBank,
	'ObojoboDraft.Chunks.Question': Question,
	'ObojoboDraft.Chunks.MCAssessment': MCAssessment,
	'ObojoboDraft.Chunks.MCAssessment.MCChoice': MCChoice,
	'ObojoboDraft.Chunks.MCAssessment.MCAnswer': MCAnswer,
	'ObojoboDraft.Chunks.MCAssessment.MCFeedback': MCFeedback
}

const Node = props => {
	return <div className={'page-editor'}>{props.children}</div>
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	if (node.data) json.content = node.data.get('content') || {}
	json.children = []

	node.nodes.forEach(child => {
		if (nodes.hasOwnProperty(child.type)) {
			json.children.push(nodes[child.type].helpers.slateToObo(child))
		} else {
			json.children.push(DefaultNode.helpers.slateToObo(child))
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	node.children.forEach(child => {
		json.nodes.push(Component.helpers.oboToSlate(child))
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case PAGE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Pages.Page': {
				nodes: [{ match: [ { type: 'oboeditor.component' } ], min: 1 }],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								object: 'block',
								type: 'oboeditor.component'
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							const block = Block.create({
								object: 'block',
								type: 'oboeditor.component'
							})
							return change.wrapBlockByKey(child.key, block)
						}
					}
				}
			}
		}
	}
}

const PageNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default PageNode
