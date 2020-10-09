import AssessmentAPI from '../util/assessment-api'
import ViewerAPI from '../util/viewer-api'
import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
import AssessmentUtil from '../util/assessment-util'
import CurrentAssessmentStates from '../util/current-assessment-states'
import Common from 'Common'
import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import AssessmentNetworkStates from './assessment-store/assessment-network-states'
import NavStore from '../stores/nav-store'
import NavUtil from '../util/nav-util'
import QuestionStore from './question-store'
import QuestionUtil from '../util/question-util'
import React from 'react'
import AssessmentStateMachine from './assessment-state-machine'
import AssessmentStateActions from './assessment-store/assessment-state-actions'
import findItemsWithMaxPropValue from '../../common/util/find-items-with-max-prop-value'
// import UnfinishedAttemptDialog from 'obojobo-sections-assessment/components/dialogs/unfinished-attempt-dialog'
import ResultsDialog from 'obojobo-sections-assessment/components/dialogs/results-dialog'
import PreAttemptImportScoreDialog from 'obojobo-sections-assessment/components/dialogs/pre-attempt-import-score-dialog'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const ASSESSMENT_NODE_TYPE = 'ObojoboDraft.Sections.Assessment'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
const { SimpleDialog, Dialog } = Common.components.modal

const {
	PROMPTING_FOR_RESUME,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	SENDING_RESPONSES,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	NOT_IN_ATTEMPT,
	ENDING_ATTEMPT,
	END_ATTEMPT_FAILED,
	END_ATTEMPT_SUCCESSFUL,
	PROMPTING_FOR_IMPORT,
	IMPORTING_ATTEMPT,
	IMPORT_ATTEMPT_FAILED,
	IMPORT_ATTEMPT_SUCCESSFUL
} = AssessmentNetworkStates

const ATTEMPT_HISTORY_NOT_LOADED = 'none'
const ATTEMPT_HISTORY_LOADING = 'loading'
const ATTEMPT_HISTORY_LOADED = 'loaded'

const getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	state: AssessmentNetworkStates.NO_ATTEMPT_STARTED,
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
			// this.endAttemptWithAPICall(payload.value.id, payload.value.context)
			this.endAttempt(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:forceSendResponses', payload => {
			this.forceSendResponses(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('window:closeAttempt', shouldPrompt => {
			if (AssessmentUtil.isInAssessment(this.state)) {
				shouldPrompt()
			}
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

		Dispatcher.on('assessment:resumeAttempt', payload => {
			this.resumeAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:continueAttempt', payload => {
			this.continueAttempt(payload.value.id)
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

	// findUnfinishedAttemptInAssessmentSummary(summaries) {
	// 	return summaries.find(s => typeof s.unfinishedAttemptId === 'string')
	// }

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

		// const unfinishedAttempt = this.findUnfinishedAttemptInAssessmentSummary(ext.assessmentSummary)
		const unfinishedAttempt = ext.assessmentSummary || null

		//importable score
		/*
		{
			highestScore: importableScore.score,
			assessmentDate: importableScore.createdAt,
			assessmentId: importableScore.assessmentId,
			attemptId: importableScore.attemptId,
			assessmentScoreId: importableScore.id
		}
		*/

		console.log(
			'importableScore',
			ext.importableScore,
			arrayToObject([ext.importableScore], 'assessmentId')
		)

		this.state = {
			assessments: {}, // assessments found in attempt history
			machines: {},
			importableScores: arrayToObject([ext.importableScore], 'assessmentId'),
			// isScoreImported: false, // @TODO: this will need to be updated to support multiple assessments
			// importableScore: ext.importableScore,
			assessmentSummaries: arrayToObject(ext.assessmentSummary, 'assessmentId'),
			// attemptHistoryNetworkState: 'none', // not loaded yet
			isResumingAttempt: unfinishedAttempt !== undefined //eslint-disable-line no-undefined
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

	startAttempt(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't start attempt - No assessment!"
		}

		machine.send(AssessmentStateActions.START_ATTEMPT)
	}

	importAttempt(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't import attempt - No assessment!"
		}

		machine.send(AssessmentStateActions.IMPORT_ATTEMPT)
	}

	abandonImport(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't abandon import - No assessment!"
		}

		machine.send(AssessmentStateActions.ABANDON_IMPORT)
	}

	endAttempt(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't end attempt - No assessment!"
		}

		if (machine.getCurrentState() !== SEND_RESPONSES_SUCCESSFUL) {
			throw "Can't end attempt - Have not sent responses successfully!"
		}

		machine.send(AssessmentStateActions.END_ATTEMPT)
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

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}

	// displayPreAttemptImportScoreNotice(highestScore) {
	// 	return new Promise(resolve => {
	// 		const shouldImport = choice => resolve(choice)

	// 		ModalUtil.show(
	// 			<PreAttemptImportScoreDialog highestScore={highestScore} onChoice={shouldImport} />
	// 		)
	// 	})
	// }

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

	forceSendResponses(assessmentId, context) {
		const assessmentModel = OboModel.models[assessmentId]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't send responses - No assessment!"
		}

		machine.send(AssessmentStateActions.SEND_RESPONSES)
	}

	acknowledgeEndAttemptSuccessful(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge end attempt - No assessment!"
		}

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeStartAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge start attempt failed - No assessment!"
		}

		console.log('@TODO - this should happen in the state machine', assessmentModel)

		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)
		assessment.current = null

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeEndAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge end attempt failed - No assessment!"
		}

		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)
		delete assessment.current.error

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeResumeAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge resume attempt failed - No assessment!"
		}

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	resumeAttempt(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't resume attempt - No assessment!"
		}

		console.log('@TODO - Decide how to handle not in right state errors')

		machine.send(AssessmentStateActions.RESUME_ATTEMPT)
	}

	continueAttempt(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't continue attempt - No assessment!"
		}

		console.log('@TODO - Decide how to handle not in right state errors')

		machine.send(AssessmentStateActions.CONTINUE_ATTEMPT)
	}
}

const assessmentStore = new AssessmentStore()
window.__as = assessmentStore
export default assessmentStore
