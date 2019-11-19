import AssessmentAPI from '../util/assessment-api'
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


class AssessmentStore extends Store {
	constructor() {
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.startAttemptWithImportScoreOption(payload.value.id)
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
		const ext = {assessmentSummary: [], importableScore: null}
		const filteredExtArrays = extensions.filter(val => val.name === 'ObojoboDraft.Sections.Assessment')
		Object.assign(ext, ...filteredExtArrays) // merge matching extensions

		this.state = {
			assessments: {},
			importHasBeenUsed: false, // @TODO: this will need to be altered to support multiple assessments
			importableScore: ext.importableScore,
			assessmentSummary: ext.assessmentSummary,
			attemptHistoryLoadState: 'none' // not loaded yet
		}

		// Any unfinished attempts?
		const unfinishedAttempt = ext.assessmentSummary.find(el => el.unfinishedAttemptId !== null)
		if(unfinishedAttempt) this.displayUnfinishedAttemptNotice(unfinishedAttempt.unfinishedAttemptId)

		// Importable score?
		if(ext.importableScore && this.state.importHasBeenUsed !== true){
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

	displayUnfinishedAttemptNotice(attemptId){
		ModalUtil.show(
			<SimpleDialog
				ok
				title="Resume Attempt"
				onConfirm={this.resumeAttemptWithAPICall.bind(this, attemptId)}
			>
				<p>
					It looks like you were in the middle of an attempt. We&apos;ll resume where you left
					off.
				</p>
			</SimpleDialog>,
			true
		)
	}

	// get an assessment summary from the state object
	getAssessmentSummaryById(assessmentId, createIfMissing = true){
		// search for it in our summaries
		let summary = this.state.assessmentSummary.find(s => s.assessmentId === assessmentId)

		// none found, make one?
		if(!summary && createIfMissing){
			summary = {
				assessmentId: assessmentId,
				importUsed: false,
				scores: [],
				unfinishedAttemptId: null
			}

			// add to the state
			this.state.assessmentSummary[assessmentId] = summary
		}

		return summary
	}

	getAssessmentById(assessmentId, createIfMissing = true){
		let assessment = this.state.assessments[assessmentId]

		if (!stateAssessment && createIfMissing) {
			assessment = {
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
			}

			this.state.assessments[assessmentId] = assessment
		}

		return assessment
	}

	updateAttempts(attemptsByAssessment) {
		// copy data into our state
		attemptsByAssessment.forEach(assessmentItem => {
			const assessId = assessmentItem.assessmentId
			const attempts = assessmentItem.attempts
			const stateSummary = this.getAssessmentSummaryById(assessId)
			const stateAssessment = this.getAssessmentById(assessId)

			// copy attempts into state
			stateAssessment.attempts = attempts

			// copy ltiState into state
			stateAssessment.lti = assessmentItem.ltiState

			// find highest attemptScore
			stateAssessment.highestAttemptScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'result.attemptScore'
			)

			// find highest assessmentScore
			stateAssessment.highestAssessmentScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'assessmentScore'
			)

			// reset and fill below
			stateSummary.scores = []

			// rebuild stateSummary.scores
			// update importUsed
			// update unfinishedAttemptId
			attempts.forEach(attempt => {
				if(attempt.isImported){
					this.state.importHasBeenUsed = true
					stateSummary.importUsed = true
				}

				if(!attempt.isFinished){
					stateSummary.unfinishedAttemptId = attempt.id
				}
				else{
					stateSummary.scores.push(attempt.assessmentScore)
				}
			})

			// can no longer import now that we have a score
			if(stateSummary.scores.length) this.state.importableScore = null
		})

		// UPDATE QUESTION STORE
		// @TODO: endAttempt calls  QuestionUtil.hideQuestion and QuestionUtil.clearResponse, then we do this. is it needed?
		for (const assessment in this.state.assessments) {
			this.state.assessments[assessment].attempts.forEach(attempt => {
				const qState = {
					scores: {},
					responses: {}
				}

				attempt.result.questionScores.forEach(score => {
					qState.scores[score.id] = score
				})

				attempt.questionResponses.forEach(resp => {
					qState.responses[resp.questionId] = resp.response
				})

				QuestionStore.updateStateByContext(qState, `assessmentReview:${attempt.id}`)
			})
		}
	}

	resumeAttemptWithAPICall(unfinishedAttemptId) {
		ModalUtil.hide()
		const navState = NavStore.getState()
		return AssessmentAPI.resumeAttempt({
			draftId: navState.draftId,
			attemptId: unfinishedAttemptId,
			visitId: navState.visitId
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

	onImportScoreNoticeChoice(resolve, shouldImport){
		ModalUtil.hide()
		resolve(shouldImport)
	}

	getAttemptHistory(){
		const { draftId, visitId } = NavStore.getState()
		this.state.attemptHistoryLoadState = 'loading'
		return AssessmentAPI.getAttemptHistory({draftId, visitId})
		.then(res => {
			if (res.status === 'error') {
				return ErrorUtil.errorResponse(res)
			}

			this.updateAttempts(res.value)
			this.state.attemptHistoryLoadState = 'loaded'
			this.triggerChange()
		})
	}

	startImportScoresWithAPICall(draftId, visitId, assessmentId){
		return AssessmentAPI.importScore({
			visitId,
			draftId,
			assessmentId,
			importedAssessmentScoreId: this.state.importableScore.assessmentScoreId
		})
		.then(result => {
			if(result.status === 'ok'){
				this.state.importHasBeenUsed = true
				// load new attempt history
				return AssessmentAPI.getAttemptHistory({draftId, visitId})
				.then(res => {
					if (res.status === 'error') {
						return ErrorUtil.errorResponse(res)
					}

					this.updateAttempts(res.value)
					this.triggerChange()
				})
			}
			return result
		})
	}

	startAttemptWithAPICall(draftId, visitId, assessmentId){
		return AssessmentAPI.startAttempt({
			draftId,
			assessmentId,
			visitId
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
	}

	displayImportAlreadyUsed(importableScore) {
		Dispatcher.trigger('viewer:alert', {
			value: {
				title: 'Score Already Imported',
				message: 'You have already imported a score for this module in this course, no attempts remain.'
			}
		})
	}

	startAttemptWithImportScoreOption(assessmentId) {
		// import has been used, do nothing
		if(this.state.importHasBeenUsed === true){
			this.displayImportAlreadyUsed()
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
				if(this.state.importableScore && this.state.importableScore.assessmentId === assessmentId){
					const onImport = this.onImportScoreNoticeChoice.bind(this, resolve, true)
					const onNotImport = this.onImportScoreNoticeChoice.bind(this, resolve, false)
					this.displayPreAttemptImportScoreNotice(this.state.importableScore, onImport, onNotImport)
				}
				else {
					// no importable score, move on
					resolve(false)
				}
			})
			.then(shouldImport => {
				const { draftId, visitId } = NavStore.getState()
				if(shouldImport){
					return this.startImportScoresWithAPICall(draftId, visitId, assessmentId)
				}
				else{
					return this.startAttemptWithAPICall(draftId, visitId, assessmentId)
				}
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

	tryEndAttempt(assessmentId, context) {
		const assessment = this.state.assessments[assessmentId]
		const { draftId, visitId } = NavStore.getState()
		return AssessmentAPI.endAttempt({
			attemptId: assessment.current.attemptId,
			draftId,
			visitId
		})
		.then(res => {
			if (res.status === 'error') {
				return ErrorUtil.errorResponse(res)
			}
			// @TODO: it'd be nice to display the score result dialog here using the results from endAttempt rather than later
			return this.getAttemptHistory()
		})
		.then(() => {
			this.endAttempt(assessmentId, context)
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

	endAttempt(assessmentId, context) {
		const assessment = this.state.assessments[assessmentId]
		const model = OboModel.models[assessmentId]

		// flip all questions back over
		assessment.current.state.chosen.forEach(question => {
			if (question.type === QUESTION_NODE_TYPE) {
				QuestionUtil.hideQuestion(question.id, context)
			}
		})

		// clear responses for each question in this assessment
		assessment.currentResponses.forEach(questionId =>
			QuestionUtil.clearResponse(questionId, context)
		)

		assessment.current = null

		model.processTrigger('onEndAttempt')

		Dispatcher.trigger('assessment:attemptEnded', assessmentId)

		const attempt = AssessmentUtil.getLastAttemptForModel(this.state, model)
		const reporter = new AssessmentScoreReporter({
			assessmentRubric: model.modelState.rubric.toObject(),
			totalNumberOfAttemptsAllowed: model.modelState.attempts,
			allAttempts: assessment.attempts
		})

		const assessmentLabel = NavUtil.getNavLabelForModel(NavStore.getState(), model)
		const scoreReport = reporter.getReportFor(attempt.attemptNumber)
		this.displayResultsModal(assessmentLabel, attempt.attemptNumber, scoreReport)
	}

	displayResultsModal(label, attemptNumber, scoreReport){
		ModalUtil.show(
			<Dialog
				modalClassName="obojobo-draft--sections--assessment--results-modal"
				centered
				buttons={[
					{
						value: `Show ${label} Overview`,
						onClick: this.onCloseResultsDialog.bind(this),
						default: true
					}
				]}
				title={`Attempt ${attemptNumber} Results`}
				width="35rem"
			>
				<AssessmentScoreReportView report={scoreReport} />
			</Dialog>
		)
	}

	tryResendLTIScore(assessmentId) {
		const assessmentModel = OboModel.models[assessmentId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return AssessmentAPI.resendLTIAssessmentScore({
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
