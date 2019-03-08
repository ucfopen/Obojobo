/* eslint no-alert: 0 */
import { Block } from 'slate'

import './editor-component.scss'

import Page from 'obojobo-pages-page/editor'
import React from 'react'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

// A single score action
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
// The whole array of score actions
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

class Score extends React.Component {
	constructor(props) {
		super(props)
	}

	changeRange() {
		const dataFor = this.props.node.data.get('for')
		const newRange = window.prompt('Enter the new range:', dataFor) || dataFor

		const editor = this.props.editor

		return editor.setNodeByKey(this.props.node.key, { data: { for: newRange } })
	}

	deleteNode() {
		const editor = this.props.editor

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		const dataFor = this.props.node.data.get('for')
		return (
			<div className={'score-actions-page pad'}>
				{this.props.children}
				<div className={'action-data'}>
					<h2>{'Score Range: ' + dataFor + ' '}</h2>
					<button
						className="range-edit"
						onClick={() => this.changeRange()}
						aria-label="Edit Score Range"
					>
						✎
					</button>
				</div>
				<button
					className={'editor--page-editor--delete-node-button'}
					onClick={() => this.deleteNode()}
				>
					X
				</button>
			</div>
		)
	}
}

const Node = props => {
	const addAction = () => {
		const editor = props.editor

		const newScore = Block.create({
			type: SCORE_NODE,
			data: { for: '[0,100]' }
		})
		return editor.insertNodeByKey(props.node.key, props.node.nodes.size, newScore)
	}

	return (
		<div className={'scoreactions'}>
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
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case SCORE_NODE:
				return <Score {...props} {...props.attributes} />
			case ACTIONS_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment.ScoreActions': {
				nodes: [{ match: [{ type: SCORE_NODE }], min: 1 }],
				normalize: (editor, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_MIN_INVALID: {
							const block = Block.create({
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return editor.wrapBlockByKey(child.key, {
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.ScoreAction': {
				nodes: [{ match: [{ type: PAGE_NODE }], min: 1 }],
				normalize: (editor, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_MIN_INVALID: {
							const block = Block.create({
								type: PAGE_NODE
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return editor.wrapBlockByKey(child.key, {
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
