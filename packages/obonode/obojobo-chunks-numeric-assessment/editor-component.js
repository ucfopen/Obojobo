import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import { NUMERIC_CHOICE_NODE } from './constants'

const { Button } = Common.components

class NumericAssessment extends React.Component {
	onAddNumericInput() {
		const editor = this.props.editor

		const newNumericInput = Block.create({
			type: NUMERIC_CHOICE_NODE
		})

		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newNumericInput)
	}

	render() {
		return (
			<div className="component obojobo-draft--chunks--numeric-assessment">
				{this.props.children}
				<div contentEditable={false}>
					<Button className="add-answer-btn pad" onClick={() => this.onAddNumericInput()}>
						Add possible answer
					</Button>
				</div>
			</div>
		)
	}
}

export default NumericAssessment
