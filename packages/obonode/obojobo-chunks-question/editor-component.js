import './viewer-component.scss'
import './editor-component.scss'

import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'

class Question extends React.Component {
	constructor(props) {
		super(props)
		this.addSolution = this.addSolution.bind(this)
		this.delete = this.delete.bind(this)
		this.onSetType = this.onSetType.bind(this)
	}

	onSetType(event) {
		const type = event.target.checked ? 'survey' : 'default'
		const questionData = this.props.node.data
		const questionDataContent = questionData.get('content')
		const mcAssessmentNode = this.props.node.nodes
			.filter(node => node.type === MCASSESSMENT_NODE)
			.get(0)
		const mcAssessmentData = mcAssessmentNode.data.toJSON()

		this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...questionDataContent,
					type
				}
			}
		})

		this.props.editor.setNodeByKey(mcAssessmentNode.key, {
			data: {
				...mcAssessmentData,
				questionType: type
			}
		})
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
		const element = this.props.element
		const content = element.content
		const hasSolution = element.children[element.children.length - 1].type === SOLUTION_NODE
		let questionType

		// The question type is determined by the MCAssessment or the NumericAssessement
		// This is either the last node or the second to last node
		if (hasSolution) {
			questionType = element.children[element.children.length - 2].type
		} else {
			questionType = element.children[element.children.length - 1]
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
								<select contentEditable={false} defaultValue={questionType}>
									<option value={MCASSESSMENT_NODE}>Multiple Choice</option>
								</select>
								<label className="question-type" contentEditable={false}>
									<input
										type="checkbox"
										name="vehicle1"
										value="Bike"
										checked={content.type === 'survey'}
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
