import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import Common from 'obojobo-document-engine/src/scripts/common'
import { NUMERIC_ANSWER_NODE } from './constants'
import { CHOICE_NODE } from 'obojobo-chunks-abstract-assessment/constants'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Button } = Common.components

class NumericAssessment extends React.Component {
	onAddNumericInput() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		Transforms.insertNodes(
			this.props.editor,
			{
				type: CHOICE_NODE,
				content: { score: 100 },
				children: [
					{
						type: NUMERIC_ANSWER_NODE,
						content: {
							requirement: 'exact',
							answer: '1'
						},
						children: [{ text: '' }]
					}
				]
			},
			{ at: path.concat(this.props.element.children.length) }
		)
	}

	render() {
		// The first child is the special units element, the remaining
		// children are the answer choices:
		// let children = React.Children.toArray(this.props.children)
		// children = React.Children.toArray(children[0])
		// const units = children.shift()
		// // const choices = children.slice(1)

		// console.log(
		// 	'rendar',
		// 	units,
		// 	children,
		// 	React.Children.count(this.props.children),
		// 	this.props.element
		// )

		return (
			<div
				className={
					'component obojobo-draft--chunks--numeric-assessment is-type-' +
					this.props.element.questionType
				}
			>
				{this.props.children}
				{/* <div className="units">{units}</div>
				<div className="choices-container" contentEditable={false}>
					{children} */}
				<Button className="add-answer-btn" onClick={() => this.onAddNumericInput()}>
					+ Add possible answer
				</Button>
				{/* </div> */}
			</div>
		)
	}
}

export default withSlateWrapper(NumericAssessment)
