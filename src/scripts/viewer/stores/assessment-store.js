import Common from 'Common'

import AssessmentUtil from '../../viewer/util/assessment-util'
import QuestionUtil from '../../viewer/util/question-util'
import APIUtil from '../../viewer/util/api-util'
import NavUtil from '../../viewer/util/nav-util'
import NavStore from '../../viewer/stores/nav-store'
import LTINetworkStates from './assessment-store/lti-network-states'
import QuestionStore from './question-store'
import AssessmentScoreReporter from '../../viewer/assessment/assessment-score-reporter'
import AssessmentScoreReportView from '../../viewer/assessment/assessment-score-report-view'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models
let { ErrorUtil } = Common.util
let { SimpleDialog, Dialog } = Common.components.modal
let { ModalUtil } = Common.util

let getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	current: null,
	currentResponses: [],
	attempts: [],
	highestAssessmentScoreAttempts: [],
	highestAttemptScoreAttempts: [],
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE,
	ltiErrorCount: 0,
	isShowingAttemptHistory: false
})

class AssessmentStore extends Store {
	constructor() {
		let assessment, id, model
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.tryStartAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.tryEndAttempt(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('question:setResponse', payload => {
			this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId)
		})

		Dispatcher.on('viewer:closeAttempted', shouldPrompt => {
			if (AssessmentUtil.isInAssessment(this.state)) {
				shouldPrompt()
			}
		})
	}

	init(attemptsByAssessment) {
		this.state = {
			assessments: {}
		}

		// necessary?
		if (!attemptsByAssessment) return
		this.updateAttempts(attemptsByAssessment)
	}

	updateAttempts(attemptsByAssessment) {
		let unfinishedAttempt = null
		let nonExistantQuestions = []
		let assessments = this.state.assessments
		let assessment

		attemptsByAssessment.forEach(assessmentItem => {
			let assessId = assessmentItem.assessmentId
			let attempts = assessmentItem.attempts

			if (!assessments[assessId]) {
				assessments[assessId] = getNewAssessmentObject(assessId)
			} else {
				assessments[assessId].attempts = []
			}

			assessments[assessId].lti = assessmentItem.ltiState
			assessments[assessId].highestAttemptScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'assessmentScore'
			)
			assessments[assessId].highestAssessmentScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'attemptScore'
			)

			attempts.forEach(attempt => {
				assessment = assessments[attempt.assessmentId]

				if (!attempt.isFinished) {
					unfinishedAttempt = attempt
				} else {
					assessment.attempts.push(attempt)
				}

				attempt.state.questions.forEach(question => {
					OboModel.create(question)
				})
			})
		})

		for (let assessment in assessments) {
			assessments[assessment].attempts.forEach(attempt => {
				let scoreObject = {}
				attempt.questionScores.forEach(score => {
					scoreObject[score.id] = score
				})
				let stateToUpdate = {
					scores: scoreObject,
					responses: attempt.responses
				}
				QuestionStore.updateStateByContext(stateToUpdate, `assessmentReview:${attempt.attemptId}`)
			})
		}

		if (unfinishedAttempt) {
			return ModalUtil.show(
				<SimpleDialog
					ok
					title="Resume Attempt"
					onConfirm={this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)}
				>
					<p>
						It looks like you were in the middle of an attempt. We'll resume you where you left off.
					</p>
				</SimpleDialog>,
				true
			)
		}
	}

	onResumeAttemptConfirm(unfinishedAttempt) {
		ModalUtil.hide()

		this.startAttempt(unfinishedAttempt)
		this.triggerChange()
	}

	tryStartAttempt(id) {
		let model = OboModel.models[id]

		return APIUtil.startAttempt(model.getRoot(), model, {})
			.then(res => {
				if (res.status === 'error') {
					switch (res.value.message.toLowerCase()) {
						case 'attempt limit reached':
							ErrorUtil.show(
								'No attempts left',
								'You have attempted this assessment the maximum number of times available.'
							)
							break

						default:
							ErrorUtil.errorResponse(res)
					}
				} else {
					this.startAttempt(res.value)
				}

				this.triggerChange()
			})
			.catch(e => {
				console.error(e)
			})
	}

	startAttempt(startAttemptResp) {
		let id = startAttemptResp.assessmentId
		let model = OboModel.models[id]

		model.children.at(1).children.reset()
		for (let child of Array.from(startAttemptResp.state.questions)) {
			let c = OboModel.create(child)
			model.children.at(1).children.add(c)
		}

		if (!this.state.assessments[id]) {
			this.state.assessments[id] = getNewAssessmentObject(id)
		}

		this.state.assessments[id].current = startAttemptResp

		NavUtil.setContext(`assessment:${startAttemptResp.assessmentId}:${startAttemptResp.attemptId}`)
		NavUtil.rebuildMenu(model.getRoot())
		NavUtil.goto(id)

		model.processTrigger('onStartAttempt')
		Dispatcher.trigger('assessment:attemptStarted', id)
	}

	tryEndAttempt(id, context) {
		let model = OboModel.models[id]
		let assessment = this.state.assessments[id]
		return APIUtil.endAttempt(assessment.current)
			.then(res => {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}
				this.endAttempt(res.value, context)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e)
			})
	}

	endAttempt(endAttemptResp, context) {
		let assessId = endAttemptResp.assessmentId
		let assessment = this.state.assessments[assessId]
		let model = OboModel.models[assessId]

		assessment.current.state.questions.forEach(question => QuestionUtil.hideQuestion(question.id))
		assessment.currentResponses.forEach(questionId =>
			QuestionUtil.clearResponse(questionId, context)
		)

		assessment.current = null

		this.updateAttempts([endAttemptResp])

		model.processTrigger('onEndAttempt')

		Dispatcher.trigger('assessment:attemptEnded', assessId)

		let attempt = AssessmentUtil.getLastAttemptForModel(this.state, model)
		let reporter = new AssessmentScoreReporter({
			assessmentRubric: model.modelState.rubric.toObject(),
			totalNumberOfAttemptsAllowed: model.modelState.attempts,
			allAttempts: assessment.attempts
		})

		let assessmentLabel = NavUtil.getNavLabelForModel(NavStore.getState(), model)
		ModalUtil.show(
			<Dialog
				modalClassName="obojobo-draft--sections--assessment--results-modal"
				centered
				buttons={[
					{
						value: `Show ${assessmentLabel} Overview`,
						onClick: ModalUtil.hide,
						default: true
					}
				]}
				title={`Attempt ${attempt.attemptNumber} Results`}
				width="35rem"
			>
				<AssessmentScoreReportView report={reporter.getReportFor(attempt.attemptNumber)} />
			</Dialog>
		)
	}

	tryResendLTIScore(assessmentId) {
		let assessmentModel = OboModel.models[assessmentId]
		let assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return APIUtil.resendLTIAssessmentScore(assessmentModel.getRoot(), assessmentModel)
			.then(res => {
				assessment.ltiNetworkState = LTINetworkStates.IDLE

				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				this.updateLTIScore(
					AssessmentUtil.getAssessmentForModel(this.state, assessmentModel),
					res.value
				)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e)
			})
	}

	updateLTIScore(assessment, updateLTIScoreResp) {
		assessment.lti = updateLTIScoreResp

		let assessmentModel = OboModel.models[assessment.id]
		if (AssessmentUtil.isLTIScoreNeedingToBeResynced(this.state, assessmentModel)) {
			assessment.ltiErrorCount++
		} else {
			assessment.ltiErrorCount = 0
		}
		// Dispatcher.trigger('assessment:ltiScore')
	}

	trySetResponse(questionId, response, targetId) {
		let model = OboModel.models[questionId]
		let assessment = AssessmentUtil.getAssessmentForModel(this.state, model)

		if (!assessment || !assessment.currentResponses) {
			// Resolve false if not an error but couldn't do anything because not in an attempt
			return Promise.resolve(false)
		}

		assessment.currentResponses.push(questionId)
		this.triggerChange()
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

let assessmentStore = new AssessmentStore()
export default assessmentStore
