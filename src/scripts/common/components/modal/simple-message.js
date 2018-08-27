import React from 'react'

const SimpleMessage = props => (
	<div>
		<p>{props.children}</p>
		<button onClick={props.modal.onButtonClick.bind(null, props.confirm)}>
			{props.buttonLabel || 'OK'}
		</button>
	</div>
)

export default SimpleMessage
