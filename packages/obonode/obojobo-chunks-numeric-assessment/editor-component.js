import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import constant from './constant'

const { Button } = Common.components
const { SCORE_RULE_NODE } = constant

const emptyResponse = {
	requirement: 'Exact answer',
	answerInput: '',
	startInput: '',
	endInput: '',
	marginType: 'Absolute',
	precisionType: 'Significant digits',
	score: 100
}

class NumericAssessment extends React.Component {
	constructor() {
		super()

		this.state = {
			currSelected: null
		}
	}

	onAddNumericInput() {
		const editor = this.props.editor

		const newNumericInput = Block.create({
			type: SCORE_RULE_NODE,
			data: { scoreRule: { ...emptyResponse } }
		})

		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newNumericInput)
	}

	onSetCurrSelected(index) {
		this.setState({ currSelected: index })
	}

	render() {
		return (
			<div className="component obojobo-draft--chunks--numeric-assessment">
				{/* Use React.Children.map to add `onClick` function and pass `isSelected` to each child as props */}
				{React.Children.map(this.props.children, (child, index) => (
					<div onClick={() => this.onSetCurrSelected(index)}>
						{React.cloneElement(child, {
							isSelected: index == this.state.currSelected
						})}
					</div>
				))}
				<Button
					className="add-answer-btn pad"
					onClick={() => this.onAddNumericInput()}
					contentEditable={false}
				>
					Add possible answer
				</Button>
			</div>
		)
	}
}

export default NumericAssessment
