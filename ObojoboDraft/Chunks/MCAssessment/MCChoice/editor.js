import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

import MCAnswer from '../MCAnswer/editor'
import MCFeedback from '../MCFeedback/editor'
import DefaultNode from '../../../../src/scripts/oboeditor/default-node'

class Feedback extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	render(){
		return (
			<div className={'obojobo-draft--chunks--feedback'} {...this.props.attributes}>
				<button className={'delete'} onClick={() => this.delete()}>X</button>
				<p className={'label'} contentEditable={false}>{'Feedback'}</p>
				{this.props.children}
			</div>
		)
	}
}

class Answer extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	render(){
		return (
			<div className={'obojobo-draft--chunks--answer'} {...this.props.attributes}>
				{this.props.children}
			</div>
		)
	}
}

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.node.data.get('content')
	}
	delete(event) {
		event.stopPropagation()
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	handleScoreChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ score: event.target.checked ? 100 : 0 })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			score: event.target.checked ? 100 : 0
		}}})
		editor.onChange(change)
	}
	addFeedback() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newFeedback = Block.create({
			type: MCFEEDBACK_NODE
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newFeedback)

		editor.onChange(change)
	}
	render(){
		const hasFeedback = this.props.node.nodes.size === 2
		return (
			<div
				className={'component obojobo-draft--chunks--mc-assessment--mc-choice is-not-selected is-correct is-type-could-have-chosen is-mode-practice'}
				{...this.props.attributes}>
				<button className={'delete'} onClick={event => this.delete(event)}>X</button>
				<input type="checkbox" checked={this.state.score === 100} onChange={event => this.handleScoreChange(event)}/>
				<div className={'children'}>
					<div>
						{this.props.children}
					</div>
				</div>
				{!hasFeedback ? <button onClick={() => this.addFeedback()}>{'Add Feedback'}</button> : null}
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

	node.nodes.forEach(child => {
		// If the current Node is a registered OboNode, use its custom converter
		if(child.type === MCANSWER_NODE || child.type === MCFEEDBACK_NODE){
			json.children.push(MCAnswer.helpers.slateToObo(child))
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
	json.data = { content: {} }

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCCHOICE_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MCAssessment.MCChoice': {
				nodes: [
					{ types: [MCANSWER_NODE], min: 1, max: 1 },
					{ types: [MCFEEDBACK_NODE], max: 1}
				],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MCANSWER_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							// extra children will be deleted by slate defaults
							if (index >= 2) return
							// multiple answers will be deleted by slate defaults
							if (index === 1 && child.type !== MCFEEDBACK_NODE) return
							return change.wrapBlockByKey(
								child.key,
								{
									type: MCANSWER_NODE
								}
							)
						}
					}
				}
			}
		}
	}
}

const MCChoice = {
	components: {
		Node,
		Answer,
		Feedback
	},
	helpers: {
		slateToObo,
		oboToSlate,
	},
	plugins
}

export default MCChoice
