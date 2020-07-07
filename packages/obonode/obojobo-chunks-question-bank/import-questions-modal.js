import React, { useState, Suspense } from 'react'
import Common from 'Common'
// import JsonRenderer from './jsonRenderer'

const { SimpleDialog } = Common.components.modal
const { isOrNot, ModalUtil } = Common.util

const importQuestionModal = props => {
	const { questionList } = props
	const [isSelected, setIsSelected] = useState(questionList.map(() => false))

	const confirm = () => {
		const questionNode = Common.Registry.getItemForType('ObojoboDraft.Chunks.Question')

		const results = questionList.map(question => {
			return questionNode.oboToSlate(question.attributes)
		})

		props.importQuestions(results)
		ModalUtil.hide()
	}

	const cancel = () => {
		ModalUtil.hide()
	}

	const JsonRenderer = React.lazy(() => import('./jsonRenderer'))

	return (
		<SimpleDialog cancelOk title="Import Questions" onConfirm={confirm} onCancel={cancel}>
			<Suspense fallback={<div>Loading...</div>}>
				{questionList.map((questionModal, index) => {
					return (
						<div
							key={questionModal.id}
							className={'json-renderer ' + isOrNot(isSelected[index], 'selected')}
							onClick={() => {
								isSelected[index] = !isSelected[index]
								setIsSelected(isSelected)
							}}
						>
							{questionModal.children.map(child => {
								return <JsonRenderer key={child.id} model={child} />
							})}
						</div>
					)
				})}
			</Suspense>
		</SimpleDialog>
	)
}

export default importQuestionModal
