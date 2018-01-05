import Viewer from 'Viewer'

const { AssessmentUtil } = Viewer.util

const assessmentReviewView = assessment => {
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const highestScore = AssessmentUtil.getHighestAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const attempts = AssessmentUtil.getAllAttempts(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	return (
		<div className="score unlock">
			<h1>{`Your score is ${Math.round(recentScore)}%`}</h1>
			{recentScore === highestScore
				? <h2>This is your highest score</h2>
				: <h2>{`Your highest score was ${Math.round(highestScore)}%`}</h2>}
			{attempts.map(attempt => {
				return attemptReviewComponent(attempt)
			})}
		</div>
	)
}

const attemptReviewComponent = attemptData => {
	return <div className="review">Placeholder attempt review component</div>
}

export default assessmentReviewView
