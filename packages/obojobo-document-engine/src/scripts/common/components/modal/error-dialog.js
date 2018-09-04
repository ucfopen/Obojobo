import './error-dialog.scss'

import React from 'react'

import SimpleDialog from './simple-dialog'

const ErrorDialog = props => (
	<div className="obojobo-draft--components--modal--error-dialog">
		<SimpleDialog ok title={props.title}>
			{props.children}
		</SimpleDialog>
	</div>
)

export default ErrorDialog
