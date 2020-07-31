import React from 'react'
import SimpleDialog from 'obojobo-document-engine/src/scripts/common/components/modal/simple-dialog'

const SettingsDialog = ({title, children, onConfirm, onCancel }) => {
	return (
		<SimpleDialog
			cancelOk
			title={title}
			onConfirm={onConfirm}
			onCancel={onCancel}
		>
			<div className={'obojobo-draft--chunks--materia--properties-modal'}>
				{children}
			</div>
		</SimpleDialog>
	)
}


export default SettingsDialog

