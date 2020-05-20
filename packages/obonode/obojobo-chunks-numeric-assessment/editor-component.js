import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import Common from 'obojobo-document-engine/src/scripts/common'
import { NUMERIC_ANSWER_NODE } from './constants'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Button } = Common.components
const CHOICE_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Choice'

class NumericAssessment extends React.Component {
	onAddNumericInput() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		Transforms.insertNodes(
			this.props.editor,
			{
				type: CHOICE_NODE,
				content: { score: 0 },
				children: [
					{
						type: NUMERIC_ANSWER_NODE,
						content: {
							score: '0',
							requirement: 'exact',
							answer: '0'
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
			<div className="component obojobo-draft--chunks--numeric-assessment">
				<div>
					{this.props.children}
					<Button
						className="add-answer-btn pad"
						onClick={() => this.onAddNumericInput()}
						contentEditable={false}>
					+ Add possible answer
				</Button>
				</div>
			</div>
		)
	}
}

export default withSlateWrapper(NumericAssessment)
