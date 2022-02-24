import React from 'react'

const QuestionModal = props => (
	<div>
		<p>{props.children}</p>
		<button
			onClick={props.modal.onButtonClick.bind(
				this,
				props.cancelOnReject ? props.cancel : props.reject
			)}
		>
			{props.rejectButtonLabel || 'No'}
		</button>
		<button onClick={props.modal.onButtonClick.bind(this, props.confirm)}>
			{props.confirmButtonLabel || 'Yes'}
		</button>
	</div>
)

export default QuestionModal
