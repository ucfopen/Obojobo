import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

import './editor-component.scss'

const { Button } = Common.components

const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

class Question extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	addSolution() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newQuestion = Block.create({
			type: SOLUTION_NODE
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newQuestion)

		editor.onChange(change)
	}
	render() {
		const hasSolution = this.props.node.nodes.last().type === SOLUTION_NODE
		return (
			<div className="component obojobo-draft--chunks--question is-viewed is-mode-practice pad">
				<div className="flipper question-editor">
					<div className="content-back">
						{this.props.children}
						{hasSolution ? null : (
							<Button className="add-solution" onClick={() => this.addSolution()}>
								Add Solution
							</Button>
						)}
					</div>
				</div>
				<button className="editor--page-editor--delete-node-button" onClick={() => this.delete()}>
					X
				</button>
			</div>
		)
	}
}

export default Question
