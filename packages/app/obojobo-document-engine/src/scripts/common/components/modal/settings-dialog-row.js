import React from 'react'
import SimpleDialog from 'obojobo-document-engine/src/scripts/common/components/modal/simple-dialog'

const SettingsDialogRow = ({className, children}) => (
	<div className={`row ${className}`}>
		{children}
	</div>
)

export default SettingsDialogRow
