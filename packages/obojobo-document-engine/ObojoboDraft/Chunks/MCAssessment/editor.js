import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'
import Common from 'Common'

import MCChoice from './MCChoice/editor'
import DefaultNode from '../../../src/scripts/oboeditor/components/default-node'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

import OboEditorStore from '../../../src/scripts/oboeditor/store'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const { Button } = Common.components

const Settings = props => {
	return (
		<div className={'mc-settings'}>
			<div>{props.children}</div>
		</div>
	)
}

const ChoiceList = props => {
	const addChoice = () => {
		const editor = props.editor
		const change = editor.value.change()

		const newChoice = Block.create({
			type: MCCHOICE_NODE,
			data: { content: { score: 0 } }
		})
		change.insertNodeByKey(props.node.key, props.node.nodes.size, newChoice)

		editor.onChange(change)
	}

	return (
		<div>
			<span className={'instructions'}>{'Pick all of the correct answers'} </span>
			{props.children}
			<Button className={'choice-button pad'} onClick={() => addChoice()}>
				{'+ Add Choice'}
			</Button>
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}
	render() {
		return (
			<div
				className={
					'component obojobo-draft--chunks--mc-assessment is-response-type-pick-one-multiple-correct is-mode-practice is-not-showing-explanation is-not-scored'
				}
			>
				{this.props.children}
			</div>
		)
	}
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	let correct = 0

	node.nodes.forEach(child => {
		switch (child.type) {
			case CHOICE_LIST_NODE:
				child.nodes.forEach(choice => {
					json.children.push(MCChoice.helpers.slateToObo(choice))
					if (choice.data.get('content').score === 100) correct++
				})
				break
			case SETTINGS_NODE:
				json.content.responseType = child.nodes.first().data.get('current')
				json.content.shuffle = child.nodes.last().data.get('checked')
				break
			default:
				json.children.push(DefaultNode.helpers.slateToObo(child))
		}
	})

	if (correct > 1 && json.content.responseType === 'pick-one') {
		json.content.responseType = 'pick-one-multiple-correct'
	}
	if (correct === 1 && json.content.responseType === 'pick-one-multiple-correct') {
		json.content.responseType = 'pick-one'
	}

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	const choiceList = {
		object: 'block',
		type: CHOICE_LIST_NODE,
		nodes: []
	}

	node.children.forEach(child => {
		if (child.type === MCCHOICE_NODE) {
			choiceList.nodes.push(MCChoice.helpers.oboToSlate(child))
		} else {
			choiceList.nodes.push(DefaultNode.helpers.oboToSlate(child))
		}
	})

	json.nodes.push(choiceList)

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'responseType',
			value: node.content.responseType,
			display: 'Response Type',
			options: ['pick-one', 'pick-all']
		})
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'shuffle',
			value: node.content.shuffle,
			display: 'Shuffle',
			checked: true
		})
	)

	json.nodes.push(settings)

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case SETTINGS_NODE:
				return <Settings {...props} {...props.attributes} />
			case CHOICE_LIST_NODE:
				return <ChoiceList {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MCAssessment': {
				nodes: [
					{
						match: [{ type: CHOICE_LIST_NODE }],
						min: 1,
						max: 1
					},
					{
						match: [{ type: SETTINGS_NODE }],
						min: 1,
						max: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create({
									type: CHOICE_LIST_NODE
								})
								return change.insertNodeByKey(node.key, index, block)
							}

							const block = Block.create({
								type: SETTINGS_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							if (index === 0) {
								const block = Block.create({
									type: CHOICE_LIST_NODE
								})
								return change.wrapBlockByKey(child.key, block)
							}

							const block = Block.create({
								type: SETTINGS_NODE
							})
							return change.wrapBlockByKey(child.key, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.MCAssessment.ChoiceList': {
				nodes: [
					{
						match: [{ type: MCCHOICE_NODE }],
						min: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MCCHOICE_NODE,
								data: { content: { score: 0 } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							const block = Block.create({
								type: MCCHOICE_NODE,
								data: { content: { score: 0 } }
							})
							return change.wrapBlockByKey(child.key, block)
						}
					}
				}
			},
			'ObojoboDraft.Chunks.MCAssessment.Settings': {
				nodes: [
					{
						match: [{ type: 'Parameter' }],
						min: 2,
						max: 2
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'responseType',
										value: 'Pick One',
										display: 'Response Type',
										options: ['pick-one', 'pick-all']
									})
								)
								return change.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'shuffle',
									value: true,
									display: 'Shuffle',
									checked: true
								})
							)
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								if (index === 0) {
									const block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'responseType',
											value: 'Pick One',
											display: 'Response Type',
											options: ['pick-one', 'pick-all']
										})
									)
									return c.insertNodeByKey(node.key, index, block)
								}
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'shuffle',
										value: true,
										display: 'Shuffle',
										checked: true
									})
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

const MCAssessment = {
	components: {
		Node,
		Settings,
		ChoiceList
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

OboEditorStore.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	name: 'Multiple Choice Assessment',
	isInsertable: false,
	componentClass: Node,
	plugins
})

export default MCAssessment
