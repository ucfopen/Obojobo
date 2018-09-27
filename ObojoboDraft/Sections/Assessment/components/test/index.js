import React from 'react'

import Common from 'Common'

const { Button } = Common.components

const AssessmentTest = props => {
	const Component = props.model.getComponentClass()

	let submitButtonText = 'Loading ...'
	if (!props.isAttemptComplete) {
		submitButtonText = 'Submit (Not all questions have been answered)'
	} else if (!props.isFetching) {
		submitButtonText = 'Submit'
	}

	return (
		<div className="test">
			<Component model={props.model} moduleData={props.moduleData} />
			<div className="submit-button">
				<Button
					disabled={props.isFetching}
					onClick={props.onClickSubmit}
					value={submitButtonText}
				/>
			</div>
		</div>
	)
}

export default AssessmentTest
