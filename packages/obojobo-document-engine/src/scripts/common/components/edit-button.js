import './edit-button.scss'

import React from 'react'

const EditButton = props => (
	<div className="obojobo-draft--components--edit-button">
		<button
			onClick={props.onClick}
			tabIndex={props.shouldPreventTab ? '-1' : 1}
			disabled={props.shouldPreventTab}
		>
			Edit
		</button>
	</div>
)

EditButton.defaultProps = { indent: 0 }

export default EditButton
