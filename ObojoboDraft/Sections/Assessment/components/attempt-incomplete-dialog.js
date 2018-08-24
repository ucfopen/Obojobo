import React from 'react'

import Common from 'Common'

const { Dialog } = Common.components.modal
const { ModalUtil } = Common.util

const onCancel = () => {
	ModalUtil.hide()
}

const onSubmit = submitProp => {
	ModalUtil.hide()
	submitProp()
}

const AttemptIncompleteDialog = props => (
	<Dialog
		buttons={[
			{
				value: 'Submit as incomplete',
				altAction: true,
				isDangerous: true,
				onClick: onSubmit.bind(null, props.onSubmit)
			},
			'or',
			{
				value: 'Resume assessment',
				onClick: onCancel,
				default: true
			}
		]}
	>
		<b>Wait! You left some questions blank.</b>
		<br />
		Finish answering all questions and submit again.
	</Dialog>
)

export default AttemptIncompleteDialog
