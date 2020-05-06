import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import Common from 'obojobo-document-engine/src/scripts/common'
import { NUMERIC_CHOICE_NODE, NUMERIC_ANSWER_NODE } from './constants'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Button } = Common.components

class NumericAssessment extends React.Component {
	onAddNumericInput() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		// Get index of the last NumericChoice node
		const lastNumericChoiceIndex = this.props.element.children.reduce(
			(acc, curVal, index) =>
				this.props.element.children[index].type === NUMERIC_CHOICE_NODE ? index : acc,
			-1
		)

		Transforms.insertNodes(
			this.props.editor,
			{
				type: NUMERIC_CHOICE_NODE,
				content: {},
				children: [
					{
						type: NUMERIC_ANSWER_NODE,
						content: {
							numericChoice: {
								score: '0',
								requirement: 'exact',
								answer: '0'
							}
						},
						children: [{ text: '' }]
					}
				]
			},
			{ at: path.concat(lastNumericChoiceIndex + 1) }
		)
	}

	render() {
		console.log(this.props.element)
		return (
			<div className="component obojobo-draft--chunks--numeric-assessment">
				{this.props.children}
				{/* <div> */}
				<Button
					className="add-answer-btn pad"
					onClick={() => this.onAddNumericInput()}
					contentEditable={false}
				>
					Add possible answer
				</Button>
				{/* </div> */}
			</div>
		)
	}
}

export default withSlateWrapper(NumericAssessment)
