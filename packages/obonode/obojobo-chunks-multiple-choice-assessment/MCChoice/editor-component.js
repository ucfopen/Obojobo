import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { Button } = Common.components

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
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
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		console.log(path)
		return Transforms.insertNodes(
			this.props.editor,
			{
				type: MCFEEDBACK_NODE,
				children: [
					{
						type: TEXT_NODE,
						children: [{ text: '' }]
					}
				]
			},
			{ at: path.concat(1) }
		)
	}

	render() {
		const score = this.props.element.content.score
		const hasFeedback = this.props.element.children.length === 2

		const className =
			'component obojobo-draft--chunks--mc-assessment--mc-choice' +
			isOrNot(score === 100, 'correct') +
			' editor-mc-choice'

		return (
			<div className={className}>
				<Button className="delete-button" onClick={event => this.delete(event)}>
					×
				</Button>
				<Button className="correct-button" onClick={event => this.handleScoreChange(event)}>
					{score === 100 ? '✔ Correct' : '✖ Incorrect'}
				</Button>
				<div className="children">
					<div>{this.props.children}</div>
				</div>
				{!hasFeedback ? (
					<Button className="add-feedback" onClick={() => this.addFeedback()}>
						Add Feedback
					</Button>
				) : null}
			</div>
		)
	}
}

export default withSlateWrapper(MCChoice)
