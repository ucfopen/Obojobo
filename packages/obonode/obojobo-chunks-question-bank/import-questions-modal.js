import React from 'react'
import Common from 'Common'
import JsonRenderer from './jsonRenderer'

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
		<SimpleDialog cancelOk title="Import Questions" onConfirm={confirm} onCancel={cancel}>
			{questionList.map(model => {
				return (
					<div key={model} className="json-renderer">
						{model.children.models.map(child => {
							return <JsonRenderer key={child} json={child.attributes} />
						})}
					</div>
				)
			})}
		</SimpleDialog>
	)
}

export default importQuestionModal
