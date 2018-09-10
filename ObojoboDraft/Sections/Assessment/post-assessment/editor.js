import React from 'react'
import { Data, Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

// A single score action
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
// The whole array of score actions
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Page from '../../../Pages/Page/editor'

class Score extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			for: this.props.node.data.get('for')
		}
	}

	changeRange() {
		const newRange = window.prompt('Enter the new range:', this.state.for) || this.state.for

		// TODO Validate range

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ for: newRange })

		change.setNodeByKey(this.props.node.key, { data: { for: newRange } })
		editor.onChange(change)
	}

	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	render() {
		return (
			<div {...this.props.attributes} className={'score-actions-page pad'}>
				{this.props.children}
				<div className={'action-data'}>
					{'Score Range: ' + this.state.for + ' '}
					<button onClick={() => this.changeRange()}>Edit Range</button>
				</div>
				<button className={'delete-node'} onClick={() => this.deleteNode()}>
					{'X'}
				</button>
			</div>
		)
	}
}

const Node = props => {
	const addAction = () => {
		const editor = props.editor
		const change = editor.value.change()

		const newScore = Block.create({
			type: SCORE_NODE,
			data: { for: '[0,100]' }
		})
		change.insertNodeByKey(props.node.key, props.node.nodes.size, newScore)

		editor.onChange(change)
	}

	return (
		<div {...props.attributes} className={'scoreactions'}>
			<h1 contentEditable={false}>Score Actions</h1>
			{props.children}
			<button onClick={() => addAction()}>Add Action</button>
		</div>
	)
}

const slateToObo = node => {
	const json = []

	node.nodes.forEach(action => {
		const slateAction = {
			for: action.data.get('for')
		}

		action.nodes.forEach(page => {
			slateAction.page = Page.helpers.slateToObo(page)
		})

		json.push(slateAction)
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = ACTIONS_NODE

	json.nodes = []
	node.forEach(action => {
		const slateAction = {
			object: 'block',
			type: SCORE_NODE,
			data: { for: action.for },
			nodes: []
		}

		slateAction.nodes.push(Page.helpers.oboToSlate(action.page))

		json.nodes.push(slateAction)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case SCORE_NODE:
				return <Score {...props} />
			case ACTIONS_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment.ScoreActions': {
				nodes: [{ types: [SCORE_NODE], min: 1 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.ScoreAction': {
				nodes: [{ types: [PAGE_NODE], min: 1, max: 1 }],
				normalize: (change, violation, { node, child, index }) => {
					switch (violation) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: PAGE_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: PAGE_NODE
							})
						}
					}
				}
			}
		}
	}
}

const Actions = {
	components: {
		Node,
		Score
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Actions
