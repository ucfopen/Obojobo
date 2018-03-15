import Common from 'Common'
import Viewer from 'Viewer'

const { OboModel } = Common.models
const { AssessmentUtil } = Viewer.util
const Launch = Common.Launch
const NavUtil = Viewer.util.NavUtil

import LTIStatus from './lti-status'
import fullReview from './viewer-component-review'

const testThing = [
	{
		type: 'value',
		text: 'Attempt 2 score',
		value: '50'
	},
	{
		type: 'penalty',
		text: 'Passed on attempt 2',
		value: '1'
	},
	{
		type: 'penalty',
		text: 'Passed on attempts 1 to 2',
		value: '3'
	},
	{
		type: 'extra-credit',
		text: 'Passed on attempt 2',
		value: '4'
	},
	{
		type: 'penalty',
		text: 'Passed on attempts 2 to 3',
		value: '7'
	},
	{
		type: 'penalty',
		text: 'Passed on attempt 2',
		value: '9'
	},

	{
		type: 'total',
		text: 'Total',
		value: '34'
	}
]

const getElementStyle = type => {
	switch (type) {
		case 'penalty':
			return { color: 'red', display: 'inline-block' }
		case 'extra-credit':
			return { color: 'green', display: 'inline-block' }
		default:
			return { display: 'inline-block' }
	}
}

const ulStyle = {
	padding: 0,
	listStyleType: 'none',
	borderTop: '1px solid LightGray'
}

const modsTextList = givenObj => {
	const modsList = givenObj.map((obj, index) => {
		let { type } = obj
		let style = getElementStyle(type)

		if (index === 0) {
			return (
				<li>
					<div style={style}>
						{obj.text}
					</div>
				</li>
			)
		}

		return (
			<li>
				<div style={style}>{type.charAt(0).toUpperCase() + type.substr(1)}</div> - {obj.text}:
			</li>
		)
	})

	return (
		<ul style={ulStyle}>
			{modsList}
		</ul>
	)
}

const modsScoreList = givenObj => {
	const getOperator = type => {
		switch (type) {
			case 'extra-credit':
				return '+'
			case 'penalty':
				return '-'
			case 'value':
				return ''
			case 'total':
				return '='
		}
	}
	const modsList = givenObj.map(obj => {
		return (
			<li>
				<strong>
					{getOperator(obj.type)}
					{obj.value}%
				</strong>
			</li>
		)
	})

	return (
		<ul style={ulStyle}>
			{modsList}
		</ul>
	)
}

const scoreSubmittedView = assessment => {
	const questionScores = AssessmentUtil.getLastAttemptScoresForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const recentScore = AssessmentUtil.getLastAttemptScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)
	const isAssessmentComplete = () => {
		return !AssessmentUtil.hasAttemptsRemaining(
			assessment.props.moduleData.assessmentState,
			assessment.props.model
		)
	}
	const attemptsRemaining = AssessmentUtil.getAttemptsRemaining(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	const scoreAction = assessment.getScoreAction()
	const numCorrect = AssessmentUtil.getNumCorrect(questionScores)

	let assessmentScore = AssessmentUtil.getAssessmentScoreForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let onClickResendScore = () => {
		AssessmentUtil.resendLTIScore(assessment.props.model)
	}

	let ltiState = AssessmentUtil.getLTIStateForModel(
		assessment.props.moduleData.assessmentState,
		assessment.props.model
	)

	let assessmentLabel = NavUtil.getNavLabelForModel(
		assessment.props.moduleData.navState,
		assessment.props.model
	)

	let externalSystemLabel = Launch.getOutcomeServiceHostname()

	let childEl

	if (scoreAction.page != null) {
		let pageModel = OboModel.create(scoreAction.page)
		pageModel.parent = assessment.props.model //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		let PageComponent = pageModel.getComponentClass()
		childEl = <PageComponent model={pageModel} moduleData={assessment.props.moduleData} />
	} else {
		childEl = (
			<p>
				{scoreAction.message}
			</p>
		)
	}

	let showFullReview = (reviewType => {
		switch (reviewType) {
			case 'always':
				return true
			case 'never':
				return false
			case 'afterAttempts':
				return isAssessmentComplete()
		}
	})(assessment.props.model.modelState.review)

	return (
		<div className="score unlock">
			<div className="results-bar">
				<h1>
					{assessmentLabel} - How You Did
				</h1>

				<div className="assessment-flex-container">
					<div className="last-attempt">
						<div>Last Attempt Score</div>
						<div>
							{Math.round(recentScore)}%
						</div>
					</div>
					<div className="retained-score">
						<div style={{ paddingTop: '10px' }}>Retained Score</div>
						<h1>100%</h1>
						<div className="mod-breakdown">
							{modsTextList(testThing)}
							{modsScoreList(testThing)}
							{/* {assessmentScore === null ? '--' : Math.round(assessmentScore)}% */}
						</div>
					</div>
					<div className="attempts-remaining">
						<div>Attempts Remaining</div>
						<div>
							{attemptsRemaining}
						</div>
					</div>
				</div>

				<LTIStatus
					ltiState={ltiState}
					launch={Launch}
					onClickResendScore={onClickResendScore}
					assessmentScore={assessmentScore}
				/>
			</div>
			{childEl}
			{showFullReview
				? fullReview(assessment)
				: <div className="review">
						<p className="number-correct">{`You got ${numCorrect} out of ${questionScores.length} questions correct:`}</p>
						{questionScores.map((questionScore, index) =>
							questionResultView(assessment.props, questionScore, index)
						)}
					</div>}
		</div>
	)
}

const questionResultView = (props, questionScore, index) => {
	const questionModel = OboModel.models[questionScore.id]
	const QuestionComponent = questionModel.getComponentClass()

	return (
		<div key={index} className={questionScore.score === 100 ? 'is-correct' : 'is-not-correct'}>
			<p>{`Question ${index + 1} - ${questionScore.score === 100 ? 'Correct:' : 'Incorrect:'}`}</p>
			<QuestionComponent model={questionModel} moduleData={props.moduleData} showContentOnly />
		</div>
	)
}

export default scoreSubmittedView
