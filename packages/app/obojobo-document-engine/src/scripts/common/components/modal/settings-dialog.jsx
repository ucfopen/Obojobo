import './settings-dialog.scss'

import React from 'react'
import SimpleDialog from 'obojobo-document-engine/src/scripts/common/components/modal/simple-dialog'

const SettingsDialog = ({ title, children, onConfirm, onCancel, focusOnFirstElement }) => {
	return (
		<SimpleDialog
			cancelOk
			title={title}
			onConfirm={onConfirm}
			onCancel={onCancel}
			focusOnFirstElement={focusOnFirstElement}
		>
			<div className={'obojobo-draft--components--modal--settings-dialog'}>{children}</div>
		</SimpleDialog>
	)
}

export default SettingsDialog
