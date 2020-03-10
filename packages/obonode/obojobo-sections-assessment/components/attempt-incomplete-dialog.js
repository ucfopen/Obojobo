import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'

const { Dialog } = Common.components.modal
const { ModalUtil } = Common.util

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
				onClick: props.onCancel,
				default: true
			}
		]}
		width="35rem"
	>
		<b>Wait! You left some questions blank.</b>
		<br />
		Finish answering all questions and submit again.
	</Dialog>
)

export default AttemptIncompleteDialog
