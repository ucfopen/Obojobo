import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

import MCAnswer from '../MCAnswer/editor'
import DefaultNode from '../../../../src/scripts/oboeditor/components/default-node'
import isOrNot from '../../../../src/scripts/common/isornot'

import Common from 'Common'

class Node extends React.Component {
	constructor(props) {
		super(props)
	}

	delete(event) {
		event.stopPropagation()
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	handleScoreChange(event) {
		event.stopPropagation()
		const editor = this.props.editor
		const change = editor.value.change()
		const newScore = this.props.node.data.get('content').score === 100 ? 0 : 100

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					score: newScore
				}
			}
		})
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

	render() {
		const score = this.props.node.data.get('content').score
		const hasFeedback = this.props.node.nodes.size === 2
		const className =
			'component obojobo-draft--chunks--mc-assessment--mc-choice' +
			isOrNot(score === 100, 'correct')
		return (
			<div className={className}>
				<button className={'delete-node'} onClick={event => this.delete(event)}>
					X
				</button>
				<button className={'correct-button'} onClick={event => this.handleScoreChange(event)}>
					{score === 100 ? '✔' : '✖'}
				</button>
				<div className={'children'}>
					<div>{this.props.children}</div>
				</div>
				{!hasFeedback ? (
					<button className={'add-feedback'} onClick={() => this.addFeedback()}>
						{'Add Feedback'}
					</button>
				) : null}
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
		switch (child.type) {
			case MCANSWER_NODE:
				json.children.push(MCAnswer.helpers.slateToObo(child))
				break
			case MCFEEDBACK_NODE:
				json.children.push(MCAnswer.helpers.slateToObo(child))
				break
			default:
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
		// If the current Node is a registered OboNode, use its custom converter
		switch (child.type) {
			case MCANSWER_NODE:
				json.nodes.push(MCAnswer.helpers.oboToSlate(child))
				break
			case MCFEEDBACK_NODE:
				json.nodes.push(MCAnswer.helpers.oboToSlate(child))
				break
			default:
				json.nodes.push(DefaultNode.helpers.oboToSlate(child))
		}
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCCHOICE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MCAssessment.MCChoice': {
				nodes: [
					{
						match: [{ type: MCANSWER_NODE }],
						min: 1,
						max: 1
					},
					{
						match: [{ type: MCFEEDBACK_NODE }],
						max: 1
					}
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MCANSWER_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							// extra children will be deleted by slate defaults
							if (index >= 2) return
							// multiple answers and feedbacks will be deleted by slate defaults
							if (index === 1 && child.type !== MCFEEDBACK_NODE) return
							return change.wrapBlockByKey(child.key, {
								type: MCANSWER_NODE
							})
						}
					}
				}
			}
		}
	}
}

const MCChoice = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	name: 'Multiple Choice Choice',
	isInsertable: false,
	slateToObo,
	oboToSlate,
	plugins
})

export default MCChoice
