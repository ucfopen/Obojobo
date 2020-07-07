import './import-questions-modal.scss'

import React, { useState, Suspense } from 'react'
import Common from 'Common'

const { Dialog } = Common.components.modal
const { isOrNot, ModalUtil } = Common.util

const ModelRender = React.lazy(() => import('./modelRenderer'))

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
		<Dialog title="Select questions from the current module" buttons={buttons}>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="import-questions-model">
					{questionList.map((questionModel, index) => {
						return (
							<div
								key={questionModel.id}
								className={
									'import-model--single-question ' + isOrNot(selectStates[index], 'selected')
								}
								onClick={() => {
									selectStates[index] = !selectStates[index]
									setSelectStates([...selectStates])
								}}
							>
								{questionModel.children.map(child => {
									return <ModelRender key={child.id} model={child} />
								})}
							</div>
						)
					})}
				</div>
			</Suspense>
		</Dialog>
	)
}

export default importQuestionModal
