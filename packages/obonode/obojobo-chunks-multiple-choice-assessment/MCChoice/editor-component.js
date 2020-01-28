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
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

class MCChoice extends React.Component {
	constructor(props) {
		super(props)

		this.delete = this.delete.bind(this)
		this.handleScoreChange = this.handleScoreChange.bind(this)
		this.addFeedback = this.addFeedback.bind(this)
	}

	delete() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	handleScoreChange() {
		const score = this.props.element.content.score === 100 ? 0 : 100

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor, 
			{ content: { ...this.props.element.content, score } },
			{ at: path }
		)
	}

	addFeedback() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(
			this.props.editor,
			{
				type: MCFEEDBACK_NODE,
				content: {},
				children: [
					{
						type: TEXT_NODE,
						content: {},
						children: [
							{
								type: TEXT_NODE,
								subtype: TEXT_LINE_NODE,
								content: { indent: 0 },
								children: [{ text: '' }]
							}
						]
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
				<Button className="delete-button" onClick={this.delete}>
					×
				</Button>
				<Button className="correct-button" onClick={this.handleScoreChange}>
					{score === 100 ? '✔ Correct' : '✖ Incorrect'}
				</Button>
				<div className="children">
					<div>{this.props.children}</div>
				</div>
				{!hasFeedback ? (
					<Button className="add-feedback" onClick={this.addFeedback}>
						Add Feedback
					</Button>
				) : null}
			</div>
		)
	}
}

export default withSlateWrapper(MCChoice)
