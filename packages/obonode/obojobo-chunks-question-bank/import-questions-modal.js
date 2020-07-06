import React, { Suspense } from 'react'
import Common from 'Common'
// import JsonRenderer from './jsonRenderer'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const importQuestionModal = props => {
	const { questionList } = props

	const confirm = () => {
		ModalUtil.hide()
	}

	const cancel = () => {
		ModalUtil.hide()
	}

	const JsonRenderer = React.lazy(() => import('./jsonRenderer'))

	return (
		<SimpleDialog cancelOk title="Import Questions" onConfirm={confirm} onCancel={cancel}>
			<Suspense fallback={<div>Loading...</div>}>
				{questionList.map(questionModal => {
					return (
						<div key={questionModal.id} className="json-renderer">
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
