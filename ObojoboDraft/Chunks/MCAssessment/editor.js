import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

import MCChoice from './MCChoice/editor'
import DefaultNode from '../../../src/scripts/oboeditor/default-node'

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.node.data.get('content')
	}
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	handleTypeChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ responseType: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			responseType: event.target.value,
			shuffle: this.state.shuffle
		}}})
		editor.onChange(change)
	}
	handleShuffleChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ shuffle: event.target.checked })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			shuffle: event.target.checked,
			responseType: this.state.responseType
		}}})
		editor.onChange(change)
	}
	addChoice() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: MCCHOICE_NODE,
			data: { content: { score: 0 }}
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}

	renderChoices() {
		return (
			<div>
				<p>{'Select all of the correct answers'}</p>
				{this.props.children}
			</div>
		)
	}
	renderContent() {
		return (
			<div className={'content-box'}>
				<button
					onClick={() => this.addChoice()}>
					{'Add Choice'}
				</button>
				<div contentEditable={false}>
				{'Response Type: '}
				<select
					name={'Response Type'}
					value={this.state.responseType}
					onChange={event => this.handleTypeChange(event)}
					onClick={event => event.stopPropagation()}>
					<option value={'pick-one'}>{'Pick One'}</option>
					<option value={'pick-all'}>{'Pick All'}</option>
				</select>
				</div>
				<div contentEditable={false}>
				{' Shuffle?'}
				<input type="checkbox" checked={this.state.shuffle} onChange={event => this.handleShuffleChange(event)}/>
				</div>
			</div>
		)
	}
	render(){
		return (
			<div className={'obojobo-draft--chunks--mcassessment'} {...this.props.attributes}>
				{this.renderChoices()}
				{this.renderContent()}
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
		if(child.type === MCCHOICE_NODE){
			json.children.push(MCChoice.helpers.slateToObo(child))
			if (child.data.get('content').score === 100) correct++
		} else {
			json.children.push(DefaultNode.helpers.slateToObo(child))
		}
	})

	if(correct < 1) throw 'A question must have at least one answer'

	if(correct > 1 && json.content.responseType === 'pick-one'){
		json.content.responseType = 'pick-one-multiple-correct'
	}
	if(correct === 1 && json.content.responseType === 'pick-one-multiple-correct'){
		json.content.responseType = 'pick-one'
	}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCASSESSMENT_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MCAssessment': {
				nodes: [{ types: [MCCHOICE_NODE], min: 1 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MCCHOICE_NODE,
								data: { content: { score: 0 }}
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(
								child.key,
								{
									type: MCCHOICE_NODE,
									data: { content: { score: 0 }}
								}
							)
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
	},
	helpers: {
		slateToObo
	},
	plugins
}

export default MCAssessment
