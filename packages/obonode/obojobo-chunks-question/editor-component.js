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
		const mcAssessmentNode = this.props.node.nodes.get(1)
		const mcAssessmentData = mcAssessmentNode.data

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
		console.log(this.props.node.toJSON())
		const content = this.props.node.data.get('content')
		const hasSolution = this.props.node.nodes.last().type === SOLUTION_NODE
		let questionType

		// The question type is determined by the MCAssessment or the NumericAssessement
		// This is either the last node or the second to last node
		if(hasSolution){
			questionType = this.props.node.nodes.get(this.props.node.nodes.size - 2).type
		} else {
			questionType = this.props.node.nodes.last().type
		}

		return (
			<Node {...this.props}>
				<div
					className={`component obojobo-draft--chunks--question is-viewed pad is-type-${
						content.type
					}`}>
					<div className="flipper question-editor">
						<div className="content-back">
							<div className="question-settings">
								<label>Question Type</label>
								<select
									contentEditable={false}
									value={questionType}>
									<option value={MCASSESSMENT_NODE}>Multiple Choice</option>
								</select>
								<div className="question-type" contentEditable={false}>
									<input
										type="checkbox"
										name="vehicle1"
										value="Bike"
										checked={content.type === 'survey'}
										onChange={this.onSetType}/>
									<label>Survey Only</label>
								</div>
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
