import React from 'react'
import Common from 'Common'

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

	return (
		<SimpleDialog
			cancelOk
			title="Import Questions"
			onConfirm={confirm}
			onCancel={cancel}
			// focusOnFirstElement={this.focusOnFirstElement}
		>
			{questionList.map((question, index) => {
				return <p key={question.id}>Question {index}</p>
			})}
		</SimpleDialog>
	)
}

export default importQuestionModal
