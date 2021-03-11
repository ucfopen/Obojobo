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
		return (
			<div
				className={
					'component obojobo-draft--chunks--numeric-assessment is-type-' +
					this.props.element.questionType
				}
			>
				{this.props.children}
				<Button className="add-answer-btn" onClick={() => this.onAddNumericInput()}>
					+ Add possible answer
				</Button>
			</div>
		)
	}
}

export default withSlateWrapper(NumericAssessment)
