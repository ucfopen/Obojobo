import React from 'react'

const AssessmentPreTest = props => {
	const Component = props.model.getComponentClass()

	return (
		<div className="pre-test">
			<Component model={props.model} moduleData={props.moduleData} />
		</div>
	)
}

export default AssessmentPreTest
