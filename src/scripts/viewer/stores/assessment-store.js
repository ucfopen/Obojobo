import Common from 'Common'

import AssessmentUtil from '../../viewer/util/assessment-util'
import ScoreUtil from '../../viewer/util/score-util'
import QuestionUtil from '../../viewer/util/question-util'
import APIUtil from '../../viewer/util/api-util'
import NavUtil from '../../viewer/util/nav-util'
import LTINetworkStates from './assessment-store/lti-network-states'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models
let { ErrorUtil } = Common.util
let { SimpleDialog } = Common.components.modal
let { ModalUtil } = Common.util

let getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	current: null,
	currentResponses: [],
	attempts: [],
	score: null,
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE
})

class AssessmentStore extends Store {
	constructor() {
		let assessment, id, model
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.tryStartAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.tryEndAttempt(payload.value.id, payload.value.hasAssessmentReview)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('question:setResponse', payload => {
			this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId)
		})

		Dispatcher.on('assessment:review', payload => {
			// TODO: Handle the case where the client is out of attempts. Consider how to allow
			// the UI to update accordingly (assessment review). We'll need to fetch the appropriate
			// review data from our attempt end endpoint.
		})
	}

	init(attemptsByAssessment) {
		this.state = {
			assessments: {}
		}

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

			attempts.forEach(attempt => {
				assessment = assessments[attempt.assessmentId]

				assessment.score = attempt.assessmentScore

				if (!attempt.isFinished) {
					unfinishedAttempt = attempt
				} else {
					assessment.attempts.push(attempt)
				}

				attempt.state.questions.forEach(question => {
					if (!OboModel.models[question.id]) {
						OboModel.create(question)
					}
				})

				assessment.lti = attempt.ltiState
			})
		})

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

	_init_OLD_DELETE_ME(history) {
		let question
		if (history == null) {
			history = []
		}
		this.state = {
			assessments: {}
		}

		history.sort((a, b) => new Date(a.startTime).getTime() > new Date(b.startTime).getTime())

		let unfinishedAttempt = null
		let nonExistantQuestions = []

		for (let attempt of Array.from(history)) {
			if (!this.state.assessments[attempt.assessmentId]) {
				this.state.assessments[attempt.assessmentId] = getNewAssessmentObject(attempt.assessmentId)
			}

			if (attempt.scores && attempt.scores.assessmentScore) {
				this.state.assessments[attempt.assessmentId].score = attempt.scores.assessmentScore
			}

			if (!attempt.endTime) {
				// @state.assessments[attempt.assessmentId].current = attempt
				unfinishedAttempt = attempt
			} else {
				this.state.assessments[attempt.assessmentId].attempts.push(attempt)
			}

			for (question of Array.from(attempt.state.questions)) {
				if (!OboModel.models[question.id]) {
					nonExistantQuestions.push(question)
				}
			}
		}

		for (question of Array.from(nonExistantQuestions)) {
			OboModel.create(question)
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
				</SimpleDialog>
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

		NavUtil.rebuildMenu(model.getRoot())
		NavUtil.goto(id)

		model.processTrigger('onStartAttempt')
		Dispatcher.trigger('assessment:attemptStarted', id)
	}

	tryEndAttempt(id, hasAssessmentReview) {
		let model = OboModel.models[id]
		let assessment = this.state.assessments[id]

		return APIUtil.endAttempt(assessment.current)
			.then(res => {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				this.endAttempt(res.value, hasAssessmentReview)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e)
			})
	}

	endAttempt(endAttemptResp, hasAssessmentReview) {
		let assessId = endAttemptResp.assessmentId
		let assessment = this.state.assessments[assessId]
		let model = OboModel.models[assessId]

		// @TODO remove this
		if (!model.modelState.review) {
			assessment.current.state.questions.forEach(question => QuestionUtil.hideQuestion(question.id))
			assessment.currentResponses.forEach(questionId => QuestionUtil.clearResponse(questionId))
		}

		assessment.attempts.push(endAttemptResp.attempt)
		assessment.current = null
		// assessment.score = endAttemptResp.assessmentScore
		// assessment.lti = endAttemptResp.lti
		this.updateAttempts([endAttemptResp])

		model.processTrigger('onEndAttempt')

		let attemptsToSend = endAttemptResp.attempts.map(attempt => {
			return {
				attemptId: attempt.attemptId,
				score: attempt.attemptScore,
				questionScores: attempt.questionScores,
				context: `assessmentReview:${attempt.attemptId}`
			}
		})

		Dispatcher.trigger('assessment:attemptEnded', assessId)

		if (hasAssessmentReview && !AssessmentUtil.hasAttemptsRemaining(this.getState(), model)) {
			Dispatcher.trigger('score:populate', attemptsToSend)
			Dispatcher.trigger('assessment:review', {
				value: {
					id: model.get('id')
				}
			})
		}
	}

	tryResendLTIScore(assessmentId) {
		console.log('TRLS', assessmentId)

		let assessmentModel = OboModel.models[assessmentId]
		let assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		console.log('RLS', assessmentId, assessment)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return APIUtil.resendLTIAssessmentScore(assessmentModel.getRoot(), assessmentModel)
			.then(res => {
				assessment.ltiNetworkState = LTINetworkStates.IDLE

				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				console.log('assessmentModelModel', assessmentModel)

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
		console.log('update lti score', updateLTIScoreResp, assessment.lti.status)
		assessment.lti = updateLTIScoreResp
		console.log('update lti score 2', assessment.lti.status)
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

		return APIUtil.postEvent(model.getRoot(), 'assessment:setResponse', '2.0.0', {
			assessmentId: assessment.id,
			attemptId: assessment.current.attemptId,
			questionId,
			response,
			targetId
		}).then(res => {
			if (res.status === 'error') {
				return ErrorUtil.errorResponse(res)
			}
			this.triggerChange()
		})
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
