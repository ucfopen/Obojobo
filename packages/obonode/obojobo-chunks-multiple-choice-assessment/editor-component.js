import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

import './viewer-component.scss'
import './editor-component.scss'

const { Button } = Common.components

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

class MCAssessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.node.data.get('content')
	}

	addChoice() {
		const editor = this.props.editor

		const newChoice = Block.create({
			type: MCCHOICE_NODE,
			data: { content: { score: 0 } }
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newChoice)
	}

	render() {
		return (
			<div
				className={
					'component obojobo-draft--chunks--mc-assessment is-response-type-pick-one-multiple-correct is-mode-practice is-not-showing-explanation is-not-scored'
				}>
				<div>
					<span className={'instructions'}>
						Pick all of the correct answers
					</span>
					{this.props.children}
					<Button
						className={'choice-button pad'}
						onClick={this.addChoice.bind(this)}>
						+ Add Choice
					</Button>
				</div>
			</div>
		)
	}
}

export default MCAssessment
