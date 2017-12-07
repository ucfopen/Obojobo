import Common from 'Common'

import AssessmentUtil from '../../viewer/util/assessment-util'
import ScoreUtil from '../../viewer/util/score-util'
import QuestionUtil from '../../viewer/util/question-util'
import APIUtil from '../../viewer/util/api-util'
import NavUtil from '../../viewer/util/nav-util'

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
	attempts: []
})

class AssessmentStore extends Store {
	constructor() {
		let assessment, id, model
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.tryStartAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.tryEndAttempt(payload.value.id)
		})

		Dispatcher.on('question:setResponse', payload => {
			this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId)
		})
	}

	init(history) {
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

	tryEndAttempt(id) {
		let model = OboModel.models[id]
		let assessment = this.state.assessments[id]

		return APIUtil.endAttempt(assessment.current)
			.then(res => {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				this.endAttempt(res.value)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e)
			})
	}

	endAttempt(endAttemptResp) {
		let id = endAttemptResp.assessmentId
		let assessment = this.state.assessments[id]
		let model = OboModel.models[id]

		assessment.current.state.questions.forEach(question => QuestionUtil.hideQuestion(question.id))
		assessment.currentResponses.forEach(questionId => QuestionUtil.clearResponse(questionId))
		assessment.attempts.push(endAttemptResp)
		assessment.current = null

		model.processTrigger('onEndAttempt')
		Dispatcher.trigger('assessment:attemptEnded', id)
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
