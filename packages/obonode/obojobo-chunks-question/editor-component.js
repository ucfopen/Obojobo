import './viewer-component.scss'
import './editor-component.scss'

import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

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
		return (
			this.props.editor.value.document.getClosest(
				this.props.node.key,
				node => node.type === ASSESSMENT_NODE
			) !== null
		)
	}

	onSetType(event) {
		const type = event.target.checked ? 'survey' : 'default'
		const questionData = this.props.node.data
		const questionDataContent = questionData.get('content')
		const questionAssessmentNode = this.props.node.nodes
			.filter(node => node.type === MCASSESSMENT_NODE || node.type === NUMERIC_ASSESSMENT_NODE)
			.get(0)
		const questionAssessmentData = questionAssessmentNode.data.toJSON()

		this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...questionDataContent,
					type
				}
			}
		})

		// This will force an update to the question assessment child:
		this.props.editor.setNodeByKey(questionAssessmentNode.key, {
			data: {
				...questionAssessmentData
				// questionType: type
			}
		})
	}

	onSetRevealAnswer(event) {
		const revealAnswer = event.target.value

		const questionData = this.props.node.data
		const questionDataContent = questionData.get('content')

		this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...questionDataContent,
					revealAnswer
				}
			}
		})
	}

	onSetAssessmentType(event) {
		const type = event.target.value

		const newAssessment = Block.create({
			type,
			data: {
				content: {
					numericChoices: [
						{
							type: 'percent',
							score: 100,
							answer: '3',
							margin: '3',
							requirement: 'margin'
						},
						{
							type: 'absolute',
							score: 100,
							answer: '3',
							margin: '3',
							requirement: 'margin'
						}
					]
				}
			}
		})

		this.props.editor.replaceNodeByKey(
			this.props.node.nodes.get(this.props.node.nodes.size - 1).key,
			newAssessment
		)
	}

	delete() {
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}

	addSolution() {
		const editor = this.props.editor
		const newQuestion = Block.create({
			type: SOLUTION_NODE
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)
	}

	render() {
		const content = this.props.node.data.get('content')
		const hasSolution = this.props.node.nodes.last().type === SOLUTION_NODE
		const revealAnswer = content.revealAnswer
		const isTypeSurvey = content.type === 'survey'
		let questionType

		// The question type is determined by the MCAssessment or the NumericAssessement
		// This is either the last node or the second to last node
		if (hasSolution) {
			questionType = this.props.node.nodes.get(this.props.node.nodes.size - 2).type
		} else {
			questionType = this.props.node.nodes.last().type
		}

		return (
			<Node {...this.props}>
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
								<Button className="add-solution" onClick={this.addSolution}>
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

export default Question
