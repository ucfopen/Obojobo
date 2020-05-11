import './viewer-component.scss'
import './editor-component.scss'

import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

class Question extends React.Component {
	constructor(props) {
		super(props)
		this.addSolution = this.addSolution.bind(this)
		this.delete = this.delete.bind(this)
		this.onSetType = this.onSetType.bind(this)
		this.onSetAssessmentType = this.onSetAssessmentType.bind(this)
		this.onSetRevealAnswer = this.onSetRevealAnswer.bind(this)
		this.isInAssessment = this.getIsInAssessment()
	}

	getIsInAssessment() {
		return [
			...Editor.levels(
				this.props.editor,
				ReactEditor.findPath(this.props.editor, this.props.element)
			)
		].includes(([node]) => node.type)
	}

	onSetType(event) {
		const type = event.target.checked ? 'survey' : 'default'

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, type } },
			{ at: path }
		)

		const lastChildIndex = this.props.element.children.length - 1
		return Transforms.setNodes(
			this.props.editor,
			{ questionType: type },
			{ at: path.concat(lastChildIndex) }
		)
	}

	onSetAssessmentType(event) {
		const type = event.target.value

		const item = Common.Registry.getItemForType(type)
		const newBlock = item.cloneBlankNode()

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const hasSolution = this.props.element.children[this.props.element.children.length - 1].subtype === SOLUTION_NODE
		const assessmentLocation = hasSolution ? this.props.element.children.length - 2 : this.props.element.children.length - 1

		Editor.withoutNormalizing(this.props.editor, () => {
			// Remove the old assessment
			Transforms.removeNodes(this.props.editor, {
				at: path.concat(assessmentLocation)
			})
			// Insert the new assessment
			Transforms.insertNodes(this.props.editor, newBlock, {
				at: path.concat(assessmentLocation)
			})
		})
	}

	onSetRevealAnswer() {
		alert('@TODO Not implemented')
	}

	delete() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	addSolution() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(
			this.props.editor,
			{
				type: QUESTION_NODE,
				subtype: SOLUTION_NODE,
				content: { score: 0 },
				children: [
					{
						type: PAGE_NODE,
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
					}
				]
			},
			{ at: path.concat(this.props.element.children.length) }
		)
	}

	render() {
		const element = this.props.element
		const content = element.content

		const revealAnswer = content.revealAnswer
		const isTypeSurvey = content.type === 'survey'

		const hasSolution = element.children[element.children.length - 1].subtype === SOLUTION_NODE
		let questionType

		// The question type is determined by the MCAssessment or the NumericAssessement
		// This is either the last node or the second to last node
		if (hasSolution) {
			questionType = element.children[element.children.length - 2].type
		} else {
			questionType = element.children[element.children.length - 1].type
		}

		console.log('question Type', questionType)

		return (
			<Node {...this.props} className="obojobo-draft--chunks--question--wrapper">
				<div
					className={`component obojobo-draft--chunks--question is-viewed pad is-type-${content.type}`}
				>
					<div className="flipper question-editor">
						<div className="content-back">
							<div className="question-settings">
								<label>Question Type</label>
								<select
									contentEditable={false}
									value={questionType}
									onChange={this.onSetAssessmentType}
								>
									<option value={MCASSESSMENT_NODE}>Multiple choice</option>
									<option value={NUMERIC_ASSESSMENT_NODE}>Input a number</option>
								</select>
								<label className="question-type" contentEditable={false}>
									<input
										type="checkbox"
										name="survey"
										value="survey"
										checked={isTypeSurvey}
										onChange={this.onSetType}
									/>
									Survey Only
								</label>
							</div>
							{this.props.children}
							{hasSolution ? null : (
								<Button className="add-solution" onClick={this.addSolution} contentEditable={false}>
									Add Solution
								</Button>
							)}
							{!isTypeSurvey && !this.isInAssessment ? (
								<div className="show-reveal-answer-container" contentEditable={false}>
									<label>Include a button allowing students to reveal the correct answer?</label>
									<select value={revealAnswer} onChange={this.onSetRevealAnswer}>
										<option value="default">
											(Use the default setting for this question type)
										</option>
										<option value="never">No</option>
										<option value="always">Yes</option>
										<option value="when-incorrect">
											Yes, but only after submitting an incorrect answer
										</option>
									</select>
								</div>
							) : null}
						</div>
					</div>
					<Button className="delete-button" onClick={() => this.delete()}>
						×
					</Button>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Question)
