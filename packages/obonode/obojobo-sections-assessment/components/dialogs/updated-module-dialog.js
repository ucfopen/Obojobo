import React from 'react'
import Common from 'Common'

const { Dialog } = Common.components.modal

const UpdatedModuleDialog = ({ onClose, onRestart }) => (
	<Dialog
		preventEsc
		width="32rem"
		title="Updated Module"
		buttons={[
			{
				value: 'Close Dialog',
				altAction: true,
				default: true,
				onClick: onClose
			},
			{
				value: 'Restart',
				onClick: onRestart
			}
		]}
	>
		<p>A portion of this module was just updated and unfortunately has to be restarted.</p>
		<p>Click close dialog to review and catalog your answers.</p>
		<p>
			When you&apos;re ready, click reload to view the updated module before starting a new attempt.
		</p>
	</Dialog>
)

export default UpdatedModuleDialog
