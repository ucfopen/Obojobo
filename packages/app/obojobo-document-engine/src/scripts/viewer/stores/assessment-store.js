import AssessmentAPI from '../util/assessment-api'
// import ViewerAPI from '../util/viewer-api'
// import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
// import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
import AssessmentUtil from '../util/assessment-util'
// import CurrentAssessmentStates from '../util/current-assessment-states'
import Common from 'Common'
// import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import AssessmentNetworkStates from './assessment-store/assessment-network-states'
import NavStore from '../stores/nav-store'
// import NavUtil from '../util/nav-util'
// import QuestionStore from './question-store'
// import QuestionUtil from '../util/question-util'
import React from 'react'
import AssessmentStateMachine from './assessment-state-machine'
import AssessmentStateActions from './assessment-store/assessment-state-actions'
// import findItemsWithMaxPropValue from '../../common/util/find-items-with-max-prop-value'
// import UnfinishedAttemptDialog from 'obojobo-sections-assessment/components/dialogs/unfinished-attempt-dialog'
import ResultsDialog from 'obojobo-sections-assessment/components/dialogs/results-dialog'
import PreAttemptImportScoreDialog from 'obojobo-sections-assessment/components/dialogs/pre-attempt-import-score-dialog'

// const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ASSESSMENT_NODE_TYPE = 'ObojoboDraft.Sections.Assessment'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
// const { SimpleDialog, Dialog } = Common.components.modal

const {
	// PROMPTING_FOR_RESUME,
	// STARTING_ATTEMPT,
	// RESUMING_ATTEMPT,
	// IN_ATTEMPT,
	// START_ATTEMPT_FAILED,
	// RESUME_ATTEMPT_FAILED,
	// SENDING_RESPONSES,
	// SEND_RESPONSES_SUCCESSFUL,
	// SEND_RESPONSES_FAILED,
	NOT_IN_ATTEMPT
	// ENDING_ATTEMPT,
	// END_ATTEMPT_FAILED,
	// END_ATTEMPT_SUCCESSFUL,
	// PROMPTING_FOR_IMPORT,
	// IMPORTING_ATTEMPT,
	// IMPORT_ATTEMPT_FAILED,
	// IMPORT_ATTEMPT_SUCCESSFUL
} = AssessmentNetworkStates

const ATTEMPT_HISTORY_NOT_LOADED = 'none'
// const ATTEMPT_HISTORY_LOADING = 'loading'
// const ATTEMPT_HISTORY_LOADED = 'loaded'

const getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	// state: AssessmentNetworkStates.NOT_IN_ATTEMPT, //@TODO - Is this used?
	current: null,
	// currentResponses: [],
	attempts: [],
	unfinishedAttempt: null,
	highestAssessmentScoreAttempts: [],
	highestAttemptScoreAttempts: [],
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE,
	ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
	attemptHistoryNetworkState: ATTEMPT_HISTORY_NOT_LOADED,
	isScoreImported: false
})

const getNewAssessmentSummary = assessmentId => ({
	assessmentId,
	importUsed: false,
	scores: [],
	unfinishedAttemptId: null
})

const arrayToObject = (a, key) => {
	const o = {}
	a.forEach(v => {
		if (v && v[key]) {
			o[v[key]] = v
		}
	})

	return o
}

class AssessmentStore extends Store {
	constructor() {
		super('assessmentstore')

		// Dispatcher.on('nav:ready', () => {
		// 	this.startMachines()
		// })

		// Dispatcher.on('assessment:startAttempt', payload => {
		// 	this.startAttemptWithImportScoreOption(payload.value.id)
		// })
		Dispatcher.on('assessment:startAttempt', payload => {
			this.startAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:importAttempt', payload => {
			this.importAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:abandonImport', payload => {
			this.abandonImport(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.endAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:forceSendResponses', payload => {
			this.forceSendResponses(payload.value.id)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeEndAttemptSuccessful', payload => {
			this.acknowledgeEndAttemptSuccessful(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeStartAttemptFailed', payload => {
			this.acknowledgeStartAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeEndAttemptFailed', payload => {
			this.acknowledgeEndAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeResumeAttemptFailed', payload => {
			this.acknowledgeResumeAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeImportAttemptFailed', payload => {
			this.acknowledgeImportAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:resumeAttempt', payload => {
			this.resumeAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:continueAttempt', payload => {
			this.continueAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeFetchHistoryFailed', payload => {
			this.acknowledgeFetchHistoryFailed(payload.value.id, payload.value.retry)
		})

		Dispatcher.on('window:closeAttempt', shouldPrompt => {
			if (AssessmentUtil.isInAssessment(this.state)) {
				shouldPrompt()
			}
		})

		Dispatcher.on('nav:targetChanged', payload => {
			const navTargetModel = OboModel.models[payload.value.to]
			const assessment = AssessmentUtil.getAssessmentForModel(this.state, navTargetModel)

			if (!assessment || assessment.attemptHistoryNetworkState === 'loaded') {
				return
			}

			const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, navTargetModel)
			if (machine.getCurrentState() === NOT_IN_ATTEMPT) {
				machine.send(AssessmentStateActions.FETCH_ATTEMPT_HISTORY)
			}
		})
	}

	getAssessmentModels() {
		return Object.values(OboModel.models).filter(
			model => model.get('type') === ASSESSMENT_NODE_TYPE
		)
	}

	init(extensions) {
		const ext = { assessmentSummary: [], importableScore: null }
		const filteredExtArrays = extensions
			? extensions.filter(val => val.name === ASSESSMENT_NODE_TYPE)
			: []
		Object.assign(ext, ...filteredExtArrays) // merge matching extensions

		const unfinishedAttempt = ext.assessmentSummary[0] || null //@TODO - Correct?

		this.state = {
			assessments: {}, // assessments found in attempt history
			machines: {},
			importableScores: arrayToObject([ext.importableScore], 'assessmentId'),
			assessmentSummaries: arrayToObject(ext.assessmentSummary, 'assessmentId'),
			isResumingAttempt: unfinishedAttempt !== null //eslint-disable-line no-undefined
		}

		// Find all the assessments:
		this.getAssessmentModels().forEach(model => {
			const id = model.get('id')

			if (!this.state.assessmentSummaries[id]) {
				this.state.assessmentSummaries[id] = getNewAssessmentSummary(id)
			}

			this.state.assessments[id] = getNewAssessmentObject(id)
			this.state.machines[id] = new AssessmentStateMachine(id, this.state)
			this.state.machines[id].start(this.triggerChange.bind(this))
		})

		if (ext.importableScore) {
			this.displayScoreImportNotice()
		}
	}

	doMachineAction(id, command) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw 'No machine exists for this assessment - Unable to run ' + command
		}

		machine.send(command)
	}

	tryResendLTIScore(assessmentId) {
		const assessmentModel = OboModel.models[assessmentId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return AssessmentAPI.resendLTIAssessmentScore({
			draftId: assessmentModel.getRoot().get('draftId'),
			assessmentId,
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

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}

	displayScoreImportNotice() {
		Dispatcher.trigger('viewer:alert', {
			value: {
				title: 'Score Import Available',
				message: `You previously completed this module in another course or assignment. The option to import your highest score will be shown when you start the assessment.`
			}
		})
	}

	displayImportAlreadyUsed() {
		Dispatcher.trigger('viewer:alert', {
			value: {
				title: 'Score Already Imported',
				message:
					'You have already imported a score for this module in this course, no attempts remain.'
			}
		})
	}

	displayPreAttemptImportScoreNotice(highestScore) {
		return new Promise(resolve => {
			const shouldImport = choice => resolve(choice)

			ModalUtil.show(
				<PreAttemptImportScoreDialog highestScore={highestScore} onChoice={shouldImport} />
			)
		})
	}

	displayResultsModal(label, attemptNumber, scoreReport) {
		ModalUtil.show(
			<ResultsDialog
				label={label}
				attemptNumber={attemptNumber}
				scoreReport={scoreReport}
				onShowClick={this.onCloseResultsDialog.bind(this)}
			/>
		)
	}

	// displayUnfinishedAttemptNotice(attemptId) {
	// 	const onConfirm = this.resumeAttemptWithAPICall.bind(this, attemptId)
	// 	ModalUtil.show(<UnfinishedAttemptDialog onConfirm={onConfirm} />, true)
	// }

	startAttempt(id) {
		this.doMachineAction(id, AssessmentStateActions.START_ATTEMPT)
	}

	importAttempt(id) {
		this.doMachineAction(id, AssessmentStateActions.IMPORT_ATTEMPT)
	}

	abandonImport(id) {
		this.doMachineAction(id, AssessmentStateActions.ABANDON_IMPORT)
	}

	endAttempt(id) {
		this.doMachineAction(id, AssessmentStateActions.END_ATTEMPT)
	}

	forceSendResponses(id) {
		this.doMachineAction(id, AssessmentStateActions.SEND_RESPONSES)
	}

	acknowledgeEndAttemptSuccessful(id) {
		this.doMachineAction(id, AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeStartAttemptFailed(id) {
		this.doMachineAction(id, AssessmentStateActions.ACKNOWLEDGE)

		console.log('@TODO - this should happen in the state machine') //eslint-disable-line
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, OboModel.models[id])
		assessment.current = null
	}

	acknowledgeEndAttemptFailed(id) {
		this.doMachineAction(id, AssessmentStateActions.ACKNOWLEDGE)

		console.log('@TODO - this should happen in the state machine') //eslint-disable-line
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, OboModel.models[id])
		delete assessment.current.error
	}

	acknowledgeResumeAttemptFailed(id) {
		this.doMachineAction(id, AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeImportAttemptFailed(id) {
		this.doMachineAction(id, AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeFetchHistoryFailed(id, retry = false) {
		this.doMachineAction(
			id,
			retry ? AssessmentStateActions.FETCH_ATTEMPT_HISTORY : AssessmentStateActions.ACKNOWLEDGE
		)
	}

	resumeAttempt(id) {
		this.doMachineAction(id, AssessmentStateActions.RESUME_ATTEMPT)
	}

	continueAttempt(id) {
		this.doMachineAction(id, AssessmentStateActions.CONTINUE_ATTEMPT)
	}
}

const assessmentStore = new AssessmentStore()
window.__as = assessmentStore
export default assessmentStore
