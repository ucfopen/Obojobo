import React from 'react'
import { Block } from 'slate'
import isOrNot from '../../../../src/scripts/common/isornot'

const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

class MCChoice extends React.Component {
	constructor(props) {
		super(props)
	}

	delete(event) {
		event.stopPropagation()
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}

	handleScoreChange(event) {
		event.stopPropagation()
		const editor = this.props.editor
		const newScore = this.props.node.data.get('content').score === 100 ? 0 : 100

		return editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					score: newScore
				}
			}
		})
	}

	addFeedback() {
		const editor = this.props.editor

		const newFeedback = Block.create({
			type: MCFEEDBACK_NODE
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newFeedback)
	}

	render() {
		const score = this.props.node.data.get('content').score
		const hasFeedback = this.props.node.nodes.size === 2
		const className =
			'component obojobo-draft--chunks--mc-assessment--mc-choice' +
			isOrNot(score === 100, 'correct')
		return (
			<div className={className}>
				<button
					className="editor--page-editor--delete-node-button"
					onClick={event => this.delete(event)}
				>
					X
				</button>
				<button className="correct-button" onClick={event => this.handleScoreChange(event)}>
					{score === 100 ? '✔' : '✖'}
				</button>
				<div className="children">
					<div>{this.props.children}</div>
				</div>
				{!hasFeedback ? (
					<button className="add-feedback" onClick={() => this.addFeedback()}>
						Add Feedback
					</button>
				) : null}
			</div>
		)
	}
}

export default MCChoice
