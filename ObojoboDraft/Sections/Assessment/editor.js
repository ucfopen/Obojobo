import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Page from '../../Pages/Page/editor'
import QuestionBank from '../../Chunks/QuestionBank/editor'
import ScoreActions from './post-assessment/editor'
import Rubric from './components/rubric/editor'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const Settings = props => {
	return (
		<div {...props.attributes} className={'settings pad'}>
			<span contentEditable={false} className={'label'}>
				{'Assessment Settings'}
			</span>
			<div>{props.children}</div>
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addRubric() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newRubric = Block.create({
			type: RUBRIC_NODE,
			data: { content: { type: 'pass-fail' } }
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newRubric)

		editor.onChange(change)
	}

	render() {
		const hasRubric = this.props.node.nodes.size === 5
		return (
			<div {...this.props.attributes} className={'assessment'}>
				{this.props.children}
				{!hasRubric ? <button onClick={() => this.addRubric()}>{'Add Rubric'}</button> : null}
			</div>
		)
	}
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')
	json.children = []

	// Remove rubric if it has been deleted
	delete json.content.rubric

	node.nodes.forEach(child => {
		switch (child.type) {
			case PAGE_NODE:
				json.children.push(Page.helpers.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				json.children.push(QuestionBank.helpers.slateToObo(child))
				break
			case ACTIONS_NODE:
				json.content.scoreActions = ScoreActions.helpers.slateToObo(child)
				break
			case RUBRIC_NODE:
				json.content.rubric = Rubric.helpers.slateToObo(child)
				break
			case SETTINGS_NODE:
				json.content.attempts = child.nodes.get(0).text
				json.content.review = child.nodes.get(1).data.get('current')
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = ASSESSMENT_NODE
	json.data = { content: node.get('content') }
	json.nodes = []

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate('attempts', json.data.content.attempts + '', 'Attempts')
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate('review', json.data.content.review, 'Review', [
			'always',
			'never',
			'no-attempts-remaining'
		])
	)

	json.nodes.push(settings)

	node.attributes.children.forEach(child => {
		if (child.type === PAGE_NODE) {
			json.nodes.push(Page.helpers.oboToSlate(child))
		} else {
			json.nodes.push(QuestionBank.helpers.oboToSlate(child))
		}
	})

	json.nodes.push(ScoreActions.helpers.oboToSlate(json.data.content.scoreActions))
	if (json.data.content.rubric) json.nodes.push(Rubric.helpers.oboToSlate(json.data.content.rubric))

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case ASSESSMENT_NODE:
				return <Node {...props} />
			case SETTINGS_NODE:
				return <Settings {...props} />
		}
	},
	validateNode(node) {
		if (node.object !== 'block') return
		if (node.type !== SETTINGS_NODE) return
		if (node.nodes.first().object === 'text') return
		if (node.nodes.size !== 1) return
		if (node.nodes.first().data.get('name') === 'attempts') return

		const block = Block.create({
			type: 'Parameter',
			data: {
				name: 'attempts',
				display: 'Attempts'
			}
		})

		return change => change.insertNodeByKey(node.key, 0, block)
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment': {
				nodes: [
					{ types: [SETTINGS_NODE], min: 1, max: 1 },
					{ types: [PAGE_NODE], min: 1, max: 1 },
					{ types: [QUESTION_BANK_NODE], min: 1, max: 1 },
					{ types: [ACTIONS_NODE], min: 1, max: 1 },
					{ types: [RUBRIC_NODE], max: 1 }
				],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							let block
							switch (index) {
								case 0:
									block = Block.create({
										type: SETTINGS_NODE
									})
									break
								case 1:
									block = Block.create({
										type: PAGE_NODE
									})
									break
								case 2:
									block = Block.create({
										type: QUESTION_BANK_NODE,
										data: { content: { choose: 1, select: 'sequential' } }
									})
									break
								case 3:
									block = Block.create({
										type: ACTIONS_NODE
									})
									break
							}
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							switch (index) {
								case 0:
									return change.wrapBlockByKey(child.key, {
										type: SETTINGS_NODE
									})
								case 1:
									return change.wrapBlockByKey(child.key, {
										type: PAGE_NODE
									})
								case 2:
									return change.wrapBlockByKey(child.key, {
										type: QUESTION_BANK_NODE,
										data: { content: { choose: 1, select: 'sequential' } }
									})
								case 3:
									return change.wrapBlockByKey(child.key, {
										type: ACTIONS_NODE
									})
							}
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.Settings': {
				nodes: [{ types: ['Parameter'], min: 2, max: 2 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate('attempts', 'unlimited', 'Attempts')
								)
								return change.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate('review', 'never', 'Review', [
									'always',
									'never',
									'no-attempts-remaining'
								])
							)
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								if (index === 0) {
									const block = Block.create(
										ParameterNode.helpers.oboToSlate('attempts', 'unlimited', 'Attempts')
									)
									return c.insertNodeByKey(node.key, index, block)
								}
								const block = Block.create(
									ParameterNode.helpers.oboToSlate('review', 'never', 'Review', [
										'always',
										'never',
										'no-attempts-remaining'
									])
								)
								return c.insertNodeByKey(node.key, index, block)
							})
						}
					}
				}
			}
		}
	}
}

const Assessment = {
	components: {
		Node,
		Settings
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Assessment
