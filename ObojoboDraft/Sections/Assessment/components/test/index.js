import Common from 'Common'

const { Button } = Common.components

const AssessmentTest = props => {
	const Component = props.model.getComponentClass()

	return (
		<div className="test">
			<Component model={props.model} moduleData={props.moduleData} />
			<div className="submit-button">
				<Button
					onClick={props.onClickSubmit}
					value={
						props.isAttemptComplete ? 'Submit' : 'Submit (Not all questions have been answered)'
					}
				/>
			</div>
		</div>
	)
}

export default AssessmentTest
