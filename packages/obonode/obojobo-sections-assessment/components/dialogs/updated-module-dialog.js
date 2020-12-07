import React from 'react'
import Common from 'Common'

const { Dialog } = Common.components.modal
const { ModalUtil } = Common.util

const UpdatedModuleDialog = ({ onConfirm }) => (
	<Dialog
    preventEsc
		width="32rem"
		title="Updated Module"
		buttons={[
			{
				value: 'Cancel',
				altAction: true,
				default: true,
				onClick: ModalUtil.hide
			},
			{
				value: 'Restart',
				onClick: onConfirm
			}
		]}
	>
		<p>
      A portion of this module was just updated. Unfortunately,
      it must be restarted. Click cancel to review and catalog
      your answers or restart to start a new attempt.
    </p>
	</Dialog>
)


export default UpdatedModuleDialog
