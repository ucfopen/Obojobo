import './import-questions-modal.scss'

import React, { useState } from 'react'
import Common from 'Common'
import NodeRenderer from './node-renderer'

const { Dialog } = Common.components.modal
const { isOrNot, ModalUtil } = Common.util

const importQuestionModal = props => {
	const { questionList } = props
	const [selectStates, setSelectStates] = useState(questionList.map(() => false))

	const confirm = () => {
		props.importQuestions(questionList.filter((_question, index) => selectStates[index]))
		ModalUtil.hide()
	}

	const buttons = [
		{
			value: 'Cancel',
			altAction: true,
			onClick: ModalUtil.hide
		},
		{
			value: 'Import',
			onClick: confirm,
			default: true
		}
	]

	return (
		<Dialog
			modalClassName="import-questions-model"
			title="Select questions from the current module to import"
			buttons={buttons}
		>
			<div className="import-model--question-content">
				{questionList.map((question, index) => {
					const questionContent = question.children.filter(
						child =>
							child.type !== 'ObojoboDraft.Chunks.MCAssessment' &&
							child.type !== 'ObojoboDraft.Chunks.NumericAssessment' &&
							child.type !== 'ObojoboDraft.Chunks.Question'
					)
					const className =
						'import-model--question-content--single' + isOrNot(selectStates[index], 'selected')

					return (
						<div
							key={question.id}
							className={className}
							onClick={() => {
								selectStates[index] = !selectStates[index]
								setSelectStates([...selectStates])
							}}
						>
							<input type="checkbox" checked={selectStates[index]} readOnly />
							<div>
								<NodeRenderer key={question} value={questionContent} />
							</div>
						</div>
					)
				})}
			</div>
			<p>The selected questions above will be duplicated into your question bank</p>
		</Dialog>
	)
}

export default importQuestionModal
