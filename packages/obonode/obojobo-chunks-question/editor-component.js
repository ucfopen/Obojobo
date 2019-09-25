import './viewer-component.scss'
import './editor-component.scss'

import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { Button } = Common.components

const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

class Question extends React.Component {
	constructor(props){
		super(props)
		this.addSolution = this.addSolution.bind(this)
		this.delete = this.delete.bind(this)
		this.onSetType = this.onSetType.bind(this)
	}

	onSetType(event) {
		const questionData = this.props.node.data
		const questionDataContent = questionData.get('content')
		const mcAssessmentNode = this.props.node.nodes.get(1)
		const mcAssessmentData = mcAssessmentNode.data

		this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...questionDataContent,
					type: event.target.value
				}
			}
		})

		this.props.editor.setNodeByKey(mcAssessmentNode.key, {
			data: {
				...mcAssessmentData,
				questionType: event.target.value
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
		const state = this.props.node.data.get('content')
		const hasSolution = this.props.node.nodes.last().type === SOLUTION_NODE
		return (
			<div
				className={`component obojobo-draft--chunks--question is-viewed is-mode-practice pad is-type-${
					state.type
				}`}
			>
				<select
					className="question-type"
					contentEditable={false}
					value={state.type}
					onChange={this.onSetType}
				>
					<option value="default">Default</option>
					<option value="survey">Survey</option>
				</select>
				<div className="flipper question-editor">
					<div className="content-back">
						{this.props.children}
						{hasSolution ? null : (
							<Button className="add-solution" onClick={this.addSolution}>
								Add Solution
							</Button>
						)}
					</div>
				</div>
				<Button className="delete-button" onClick={this.delete}>
					×
				</Button>
			</div>
		)
	}
}

export default Question
