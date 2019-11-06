import APIUtil from '../util/api-util'
import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
import AssessmentUtil from '../util/assessment-util'
import Common from 'Common'
import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import NavStore from '../stores/nav-store'
import NavUtil from '../util/nav-util'
import QuestionStore from './question-store'
import QuestionUtil from '../util/question-util'
import React from 'react'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
const { SimpleDialog, Dialog } = Common.components.modal

const getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	current: null,
	currentResponses: [],
	attempts: [],
	highestAssessmentScoreAttempts: [],
	highestAttemptScoreAttempts: [],
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE,
	ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
	isShowingAttemptHistory: false
})

class AssessmentStore extends Store {
	constructor() {
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

	init(extensions) {
		const ext = {attemptHistory: [], importableScore: null}
		const filteredExtArrays = extensions.filter(val => val.name === 'ObojoboDraft.Sections.Assessment')
		Object.assign(ext, ...filteredExtArrays) // merge matching extensions

		this.state = {
			assessments: {},
			importableScore: ext.importableScore
		}

		this.updateAttempts(ext.attemptHistory)

		if(ext.importableScore){
			this.displayScoreImportNotice(ext.importableScore)
		}
	}

	displayScoreImportNotice(importableScore) {
		Dispatcher.trigger('viewer:alert', {
			value: {
				title: 'Previous Score Import',
				message: `Your instructor allows importing your previous high score (${Math.round(importableScore.highestScore)}%) for this module. The option to import will be shown when you start the Assessment.`
			}
		})
	}

	displayUnfinishedAttemptNotice(unfinishedAttempt){
		ModalUtil.show(
			<SimpleDialog
				ok
				title="Resume Attempt"
				onConfirm={this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)}
			>
				<p>
					It looks like you were in the middle of an attempt. We&apos;ll resume where you left
					off.
				</p>
			</SimpleDialog>,
			true
		)
	}

	updateAttempts(attemptsByAssessment) {
		let unfinishedAttempt = null
		const assessments = this.state.assessments
		let assessment

		attemptsByAssessment.forEach(assessmentItem => {
			const assessId = assessmentItem.assessmentId
			const attempts = assessmentItem.attempts

			if (!assessments[assessId]) {
				assessments[assessId] = getNewAssessmentObject(assessId)
			} else {
				assessments[assessId].attempts = []
			}

			assessments[assessId].lti = assessmentItem.ltiState
			assessments[assessId].highestAttemptScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'attemptScore'
			)
			assessments[assessId].highestAssessmentScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'assessmentScore'
			)

			attempts.forEach(attempt => {
				assessment = assessments[attempt.assessmentId]

				if (!attempt.isFinished) {
					unfinishedAttempt = attempt
				} else {
					assessment.attempts.push(attempt)
				}
			})
		})

		for (const assessment in assessments) {
			assessments[assessment].attempts.forEach(attempt => {
				const scoreObject = {}
				attempt.questionScores.forEach(score => {
					scoreObject[score.id] = score
				})
				const stateToUpdate = {
					scores: scoreObject,
					responses: attempt.responses
				}

				QuestionStore.updateStateByContext(stateToUpdate, `assessmentReview:${attempt.attemptId}`)
			})
		}

		if (unfinishedAttempt) {
			this.displayUnfinishedAttemptNotice(unfinishedAttempt)
		}
	}

	onResumeAttemptConfirm(unfinishedAttempt) {
		ModalUtil.hide()

		return APIUtil.resumeAttempt({
			draftId: unfinishedAttempt.draftId,
			attemptId: unfinishedAttempt.attemptId,
			visitId: NavStore.getState().visitId
		}).then(response => {
			this.startAttempt(response.value)
			this.triggerChange()
		})
	}

	displayPreAttemptImportScoreNotice(importableScore, onImport, onNotImport){
		const roundedScore = Math.round(importableScore.highestScore)
		ModalUtil.show(
			<Dialog
				centered
				buttons={[
					{
						value: 'Do Not Import',
						onClick: onNotImport
					},
					{
						value: `Import Score: ${roundedScore}%`,
						onClick: onImport
					}
				]}
				title='Import Previous Score?'
				width='300'
			>
				<p>
					You have previously completed this module and your instructor is
					allowing you to import your high score of <strong>{roundedScore}%</strong>
				</p>
				<p>
					Would you like to use that score now or ignore it and begin the Assessment?
				</p>

			</Dialog>
		)
	}

	onImportScoreSelected(resolve, shouldImport){
		ModalUtil.hide()
		resolve(shouldImport)
	}

	tryStartAttempt(id) {
		return new Promise((resolve, reject) => {
				if(this.state.importableScore){
					const onImport = this.onImportScoreSelected.bind(this, resolve, true)
					const onNotImport = this.onImportScoreSelected.bind(this, resolve, false)
					this.displayPreAttemptImportScoreNotice(this.state.importableScore, onImport, onNotImport)
				}
				else {
					// no importable score, move on
					resolve(false)
				}
			})
			.then(shouldImport => {
				// check for importable score data?
				if(shouldImport){
					// avoid starting an assessment for testing
					throw 'should import here...'
				}
			})
			.then(() => {
				const model = OboModel.models[id]

				return APIUtil.startAttempt({
					draftId: model.getRoot().get('draftId'),
					assessmentId: model.get('id'),
					visitId: NavStore.getState().visitId
				})
			})
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
				console.error(e) /* eslint-disable-line no-console */
			})
	}

	startAttempt(startAttemptResp) {
		const id = startAttemptResp.assessmentId
		const model = OboModel.models[id]

		model.children.at(1).children.reset()
		for (const child of Array.from(startAttemptResp.questions)) {
			const c = OboModel.create(child)
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
		const model = OboModel.models[id]
		const assessment = this.state.assessments[id]
		return APIUtil.endAttempt({
			attemptId: assessment.current.attemptId,
			draftId: model.getRoot().get('draftId'),
			visitId: NavStore.getState().visitId
		})
			.then(res => {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}
				this.endAttempt(res.value, context)
				this.triggerChange()
			})
			.catch(e => {
				console.error(e) /* eslint-disable-line no-console */
			})
	}

	onCloseResultsDialog() {
		ModalUtil.hide()
		FocusUtil.focusOnNavTarget()
	}

	endAttempt(endAttemptResp, context) {
		const assessId = endAttemptResp.assessmentId
		const assessment = this.state.assessments[assessId]
		const model = OboModel.models[assessId]

		assessment.current.state.chosen.forEach(question => {
			if (question.type === QUESTION_NODE_TYPE) {
				QuestionUtil.hideQuestion(question.id, context)
			}
		})

		assessment.currentResponses.forEach(questionId =>
			QuestionUtil.clearResponse(questionId, context)
		)

		 // can no longer import now that we have a score
		this.state.importableScore = null

		assessment.current = null

		this.updateAttempts([endAttemptResp])

		model.processTrigger('onEndAttempt')

		Dispatcher.trigger('assessment:attemptEnded', assessId)

		const attempt = AssessmentUtil.getLastAttemptForModel(this.state, model)
		const reporter = new AssessmentScoreReporter({
			assessmentRubric: model.modelState.rubric.toObject(),
			totalNumberOfAttemptsAllowed: model.modelState.attempts,
			allAttempts: assessment.attempts
		})

		const assessmentLabel = NavUtil.getNavLabelForModel(NavStore.getState(), model)
		ModalUtil.show(
			<Dialog
				modalClassName="obojobo-draft--sections--assessment--results-modal"
				centered
				buttons={[
					{
						value: `Show ${assessmentLabel} Overview`,
						onClick: this.onCloseResultsDialog.bind(this),
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
		const assessmentModel = OboModel.models[assessmentId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return APIUtil.resendLTIAssessmentScore({
			draftId: assessmentModel.getRoot().get('draftId'),
			assessmentId: assessmentModel.get('id'),
			visitId: NavStore.getState().visitId
		})
			.then(res => {
				assessment.ltiNetworkState = LTINetworkStates.IDLE

				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				this.updateLTIScore(
					AssessmentUtil.getAssessmentForModel(this.state, assessmentModel),
					res.value
				)
				this.triggerChange()
			})
			.catch(e => {
				console.error(e) /* eslint-disable-line no-console */
			})
	}

	updateLTIScore(assessment, updateLTIScoreResp) {
		assessment.lti = updateLTIScoreResp

		const assessmentModel = OboModel.models[assessment.id]
		if (AssessmentUtil.isLTIScoreNeedingToBeResynced(this.state, assessmentModel)) {
			assessment.ltiResyncState = LTIResyncStates.RESYNC_FAILED
		} else {
			assessment.ltiResyncState = LTIResyncStates.RESYNC_SUCCEEDED
		}

		this.triggerChange()
	}

	trySetResponse(questionId) {
		const model = OboModel.models[questionId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, model)

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

const assessmentStore = new AssessmentStore()
export default assessmentStore
