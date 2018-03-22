import Common from 'Common'
import Viewer from 'Viewer'

const { Button } = Common.components
const { AssessmentUtil } = Viewer.util

const takingTestView = assessment => {
	const moduleData = assessment.props.moduleData
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const child = assessment.props.model.children.at(1)
	const Component = child.getComponentClass()
	return (
		<div className="test">
			<Component
				className="untested"
				model={child}
				moduleData={moduleData}
				showScore={recentScore !== null}
			/>
			<div className="submit-button">
				<Button
					onClick={assessment.onClickSubmit.bind(assessment)}
					value={
						assessment.isAttemptComplete()
							? 'Submit'
							: 'Submit (Not all questions have been answered)'
					}
				/>
			</div>
		</div>
	)
}

export default takingTestView
