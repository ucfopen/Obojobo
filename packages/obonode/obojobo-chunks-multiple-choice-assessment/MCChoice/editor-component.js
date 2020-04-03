import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import MoreInfoBox from 'obojobo-document-engine/src/scripts/oboeditor/components/navigation/more-info-box'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { Button } = Common.components
const { OboModel } = Common.models

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

class MCChoice extends React.Component {
	constructor(props) {
		super(props)

		this.delete = this.delete.bind(this)
		this.handleScoreChange = this.handleScoreChange.bind(this)
		this.addFeedback = this.addFeedback.bind(this)
		this.duplicateNode = this.duplicateNode.bind(this)
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

	duplicateNode() {
		const newNode = { ...this.props.element }

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		path[path.length - 1]++
		Transforms.insertNodes(this.props.editor, newNode, { at: path })
	}

	saveId(prevId, newId) {
		if (prevId.localeCompare(newId) === 0) return

		// check against existing nodes for duplicate keys
		const model = OboModel.models[prevId]

		if (!newId) {
			return 'Please enter an id'
		}

		if (!model.setId(newId)) {
			return 'The id "' + newId + '" already exists. Please choose a unique id'
		}

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { id: newId }, { at: path })
	}

	saveContent(prevContent, newContent) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { content: newContent }, { at: path })
	}

	onOpen() {
		// Lock the editor into readOnly to prevent it from stealing cursor focus
		this.props.editor.toggleEditable(false)
	}

	onClose() {
		// Give cursor focus back to the editor
		this.props.editor.toggleEditable(true)
	}

	render() {
		const score = this.props.element.content.score
		const hasFeedback = this.props.element.children.length === 2
		const isSelected = this.props.selected
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

				{isSelected ? (
					<MoreInfoBox
						id={this.props.element.id}
						isFirst
						isLast
						type={this.props.element.type}
						content={this.props.element.content}
						saveId={this.saveId.bind(this)}
						saveContent={this.saveContent.bind(this)}
						contentDescription={this.props.contentDescription || []}
						deleteNode={this.delete}
						duplicateNode={this.duplicateNode}
						markUnsaved={this.props.editor.markUnsaved}
						onOpen={this.onOpen.bind(this)}
						onClose={this.onClose.bind(this)}
					/>
				) : null}
			</div>
		)
	}
}

export default withSlateWrapper(MCChoice)
