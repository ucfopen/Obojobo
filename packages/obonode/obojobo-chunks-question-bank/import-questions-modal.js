import './import-questions-modal.scss'

import React, { useState, Suspense } from 'react'
import Common from 'Common'

const { Dialog } = Common.components.modal
const { isOrNot, ModalUtil } = Common.util

const ModelRender = React.lazy(() => import('./model-renderer'))

const importQuestionModal = props => {
	const { questionList } = props
	const [selectStates, setSelectStates] = useState(questionList.map(() => false))

	const confirm = () => {
		const questionNode = Common.Registry.getItemForType('ObojoboDraft.Chunks.Question')

		const results = questionList
			.filter((_question, index) => selectStates[index])
			.map(question => {
				return questionNode.oboToSlate(question.attributes)
			})

		props.importQuestions(results)
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
			<Suspense fallback={<div>Loading...</div>}>
				<div className="import-model--question-content">
					{questionList.map((questionModel, index) => {
						return (
							<div
								key={questionModel.id}
								className={
									'import-model--question-content--single' +
									isOrNot(selectStates[index], 'selected')
								}
								onClick={() => {
									selectStates[index] = !selectStates[index]
									setSelectStates([...selectStates])
								}}
							>
								<input type="checkbox" checked={selectStates[index]} />
								{questionModel.children.map(child => {
									return <ModelRender key={child.id} model={child} />
								})}
							</div>
						)
					})}
				</div>
				<p>The selected questions above will be duplicated into your question bank</p>
			</Suspense>
		</Dialog>
	)
}

export default importQuestionModal
