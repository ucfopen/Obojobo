import '../../../scss/main.scss'
import './viewer-app.scss'

import Common from 'Common'
import React from 'react'
import IdleTimer from 'react-idle-timer'

import InlineNavButton from '../../viewer/components/inline-nav-button'
import NavUtil from '../../viewer/util/nav-util'
import APIUtil from '../../viewer/util/api-util'
import Logo from '../../viewer/components/logo'
import QuestionStore from '../../viewer/stores/question-store'
import AssessmentStore from '../../viewer/stores/assessment-store'
import NavStore from '../../viewer/stores/nav-store'
import Nav from './nav'
import getLTIOutcomeServiceHostname from '../../viewer/util/get-lti-outcome-service-hostname'

const IDLE_TIMEOUT_DURATION_MS = 600000 // 10 minutes

let { Legacy } = Common.models
let { DOMUtil } = Common.page
let { Screen } = Common.page
let { OboModel } = Common.models
let { Dispatcher } = Common.flux
let { ModalContainer } = Common.components
let { SimpleDialog } = Common.components.modal
let { ModalUtil } = Common.util
let { FocusBlocker } = Common.components
let { ModalStore } = Common.stores
let { FocusStore } = Common.stores
let { FocusUtil } = Common.util

// Dispatcher.on 'all', (eventName, payload) -> console.log 'EVENT TRIGGERED', eventName

Dispatcher.on('viewer:alert', payload =>
	ModalUtil.show(
		<SimpleDialog ok title={payload.value.title}>
			{payload.value.message}
		</SimpleDialog>
	)
)

export default class ViewerApp extends React.Component {
	// === REACT LIFECYCLE METHODS ===

	constructor(props) {
		super(props)

		Dispatcher.on('viewer:scrollTo', payload => {
			return (ReactDOM.findDOMNode(this.refs.container).scrollTop = payload.value)
		})

		Dispatcher.on('viewer:scrollToTop', this.scrollToTop.bind(this))
		Dispatcher.on('getTextForVariable', this.getTextForVariable.bind(this))

		let state = {
			model: null,
			navState: null,
			questionState: null,
			assessmentState: null,
			modalState: null,
			focusState: null,
			navTargetId: null,
			loading: true,
			requestStatus: 'unknown',
			isPreviewing: false,
			lti: {
				outcomeServiceHostname: null
			}
		}
		this.onNavStoreChange = () => this.setState({ navState: NavStore.getState() })
		this.onQuestionStoreChange = () => this.setState({ questionState: QuestionStore.getState() })
		this.onAssessmentStoreChange = () =>
			this.setState({ assessmentState: AssessmentStore.getState() })
		this.onModalStoreChange = () => this.setState({ modalState: ModalStore.getState() })
		this.onFocusStoreChange = () => this.setState({ focusState: FocusStore.getState() })

		this.onIdle = this.onIdle.bind(this)
		this.onReturnFromIdle = this.onReturnFromIdle.bind(this)
		this.onBeforeWindowClose = this.onBeforeWindowClose.bind(this)
		this.onWindowClose = this.onWindowClose.bind(this)
		this.onVisibilityChange = this.onVisibilityChange.bind(this)

		this.state = state
	}

	componentDidMount() {
		document.addEventListener('visibilitychange', this.onVisibilityChange)

		let visitIdFromApi
		let attemptHistory
		let viewState
		let isPreviewing
		let outcomeServiceURL = 'the external system'

		let urlTokens = document.location.pathname.split('/')
		let visitIdFromUrl = urlTokens[4] ? urlTokens[4] : null
		let draftIdFromUrl = urlTokens[2] ? urlTokens[2] : null

		Dispatcher.trigger('viewer:loading')

		APIUtil.requestStart(visitIdFromUrl, draftIdFromUrl)
			.then(visit => {
				QuestionStore.init()
				ModalStore.init()
				FocusStore.init()

				if (visit.status !== 'ok') throw 'Invalid Visit Id'

				visitIdFromApi = visit.value.visitId
				viewState = visit.value.viewState
				attemptHistory = visit.value.extensions[':ObojoboDraft.Sections.Assessment:attemptHistory']
				isPreviewing = visit.value.isPreviewing
				outcomeServiceURL = visit.value.lti.lisOutcomeServiceUrl

				return APIUtil.getDraft(draftIdFromUrl)
			})
			.then(({ value: draftModel }) => {
				this.state.model = OboModel.create(draftModel)

				NavStore.init(
					this.state.model,
					this.state.model.modelState.start,
					window.location.pathname,
					visitIdFromApi,
					viewState
				)
				AssessmentStore.init(attemptHistory)

				this.state.navState = NavStore.getState()
				this.state.questionState = QuestionStore.getState()
				this.state.assessmentState = AssessmentStore.getState()
				this.state.modalState = ModalStore.getState()
				this.state.focusState = FocusStore.getState()
				this.state.lti.outcomeServiceHostname = getLTIOutcomeServiceHostname(outcomeServiceURL)

				window.onbeforeunload = this.onBeforeWindowClose
				window.onunload = this.onWindowClose

				this.setState({ loading: false, requestStatus: 'ok', isPreviewing }, () => {
					Dispatcher.trigger('viewer:loaded', true)
				})
			})
			.catch(err => {
				console.log(err)
				this.setState({ loading: false, requestStatus: 'invalid' }, () =>
					Dispatcher.trigger('viewer:loaded', false)
				)
			})
	}

	componentWillMount() {
		// === SET UP DATA STORES ===
		NavStore.onChange(this.onNavStoreChange)
		QuestionStore.onChange(this.onQuestionStoreChange)
		AssessmentStore.onChange(this.onAssessmentStoreChange)
		ModalStore.onChange(this.onModalStoreChange)
		FocusStore.onChange(this.onFocusStoreChange)
	}

	componentWillUnmount() {
		NavStore.offChange(this.onNavStoreChange)
		QuestionStore.offChange(this.onQuestionStoreChange)
		AssessmentStore.offChange(this.onAssessmentStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
		FocusStore.offChange(this.onFocusStoreChange)

		document.removeEventListener('visibilitychange', this.onVisibilityChange)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !nextState.loading
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.requestStatus === 'ok') {
			let navTargetId = this.state.navTargetId
			let nextNavTargetId = this.state.navState.navTargetId

			if (navTargetId !== nextNavTargetId) {
				this.needsScroll = true
				return this.setState({ navTargetId: nextNavTargetId })
			}
		}

		if (this.state.loading === true && nextState.loading === false) {
			this.needsRemoveLoadingElement = true
		}
	}

	componentDidUpdate() {
		if (this.state.requestStatus === 'ok') {
			if (this.lastCanNavigate !== NavUtil.canNavigate(this.state.navState)) {
				this.needsScroll = true
			}
			this.lastCanNavigate = NavUtil.canNavigate(this.state.navState)
			if (this.needsScroll != null) {
				this.scrollToTop()

				delete this.needsScroll
			}
		}

		if (this.needsRemoveLoadingElement === true) {
			let loadingEl = document.getElementById('viewer-app-loading')
			if (loadingEl && loadingEl.parentElement) {
				document.getElementById('viewer-app').classList.add('is-loaded')
				loadingEl.parentElement.removeChild(loadingEl)

				delete this.needsRemoveLoadingElement
			}
		}
	}

	onVisibilityChange() {
		if (document.hidden) {
			APIUtil.postEvent(this.state.model, 'viewer:leave', '1.0.0', {}).then(res => {
				this.leaveEvent = res.value
			})
		} else {
			APIUtil.postEvent(this.state.model, 'viewer:return', '1.0.0', {
				relatedEventId: this.leaveEvent.id
			})
			delete this.leaveEvent
		}
	}

	getTextForVariable(event, variable, textModel) {
		return (event.text = Common.Store.getTextForVariable(variable, textModel, this.state))
	}

	scrollToTop() {
		let el = ReactDOM.findDOMNode(this.refs.prev)
		let container = ReactDOM.findDOMNode(this.refs.container)

		if (!container) return

		if (el) {
			return (container.scrollTop = ReactDOM.findDOMNode(el).getBoundingClientRect().height)
		}

		return (container.scrollTop = 0)
	}

	// === NON REACT LIFECYCLE METHODS ===

	onMouseDown(event) {
		if (this.state.focusState.focussedId == null) {
			return
		}
		if (!DOMUtil.findParentComponentIds(event.target).has(this.state.focusState.focussedId)) {
			return FocusUtil.unfocus()
		}
	}

	onScroll(event) {
		if (this.state.focusState.focussedId == null) {
			return
		}

		let component = FocusUtil.getFocussedComponent(this.state.focusState)
		if (component == null) {
			return
		}

		let el = component.getDomEl()
		if (!el) {
			return
		}

		if (!Screen.isElementVisible(el)) {
			return FocusUtil.unfocus()
		}
	}

	onIdle() {
		this.lastActiveEpoch = new Date(this.refs.idleTimer.getLastActiveTime())

		APIUtil.postEvent(this.state.model, 'viewer:inactive', '2.0.0', {
			lastActiveTime: this.lastActiveEpoch,
			inactiveDuration: IDLE_TIMEOUT_DURATION_MS
		}).then(res => {
			this.inactiveEvent = res.value
		})
	}

	onReturnFromIdle() {
		APIUtil.postEvent(this.state.model, 'viewer:returnFromInactive', '2.0.0', {
			lastActiveTime: this.lastActiveEpoch,
			inactiveDuration: Date.now() - this.lastActiveEpoch,
			relatedEventId: this.inactiveEvent.id
		})

		delete this.lastActiveEpoch
		delete this.inactiveEvent
	}

	onBeforeWindowClose() {
		let closePrevented = false
		// calling this function will prevent the window from closing
		let preventClose = () => {
			closePrevented = true
		}

		Dispatcher.trigger('viewer:closeAttempted', preventClose)

		if (closePrevented) {
			return true // Returning true will cause browser to ask user to confirm leaving page
		}

		return undefined // Returning undefined will allow browser to close normally
	}

	onWindowClose() {
		APIUtil.postEvent(this.state.model, 'viewer:close', '1.0.0', {})
	}

	clearPreviewScores() {
		APIUtil.clearPreviewScores(this.state.model.get('draftId')).then(res => {
			if (res.status === 'error' || res.error) {
				return ModalUtil.show(
					<SimpleDialog ok width="15em">
						{res.value && res.value.message
							? `There was an error resetting assessments and questions: ${res.value.message}.`
							: 'There was an error resetting assessments and questions'}
					</SimpleDialog>
				)
			}

			AssessmentStore.init()
			QuestionStore.init()

			AssessmentStore.triggerChange()
			QuestionStore.triggerChange()

			return ModalUtil.show(
				<SimpleDialog ok width="15em">
					Assessment attempts and all question responses have been reset.
				</SimpleDialog>
			)
		})
	}

	unlockNavigation() {
		return NavUtil.unlock()
	}

	render() {
		if (this.state.loading == true) return null

		if (this.state.requestStatus === 'invalid') {
			return (
				<div className="viewer--viewer-app--visit-error">
					{`There was a problem starting your visit. Please return to ${
						this.state.lti.outcomeServiceHostname
							? this.state.lti.outcomeServiceHostname
							: 'the external system'
					} and relaunch this module.`}
				</div>
			) //`There was a problem starting your visit. Please return to ${outcomeServiceURL} and relaunch this module.`
		}

		let nextEl, nextModel, prevEl
		window.__lo = this.state.model
		window.__s = this.state

		let ModuleComponent = this.state.model.getComponentClass()

		let navTargetModel = NavUtil.getNavTargetModel(this.state.navState)
		let navTargetTitle = '?'
		if (navTargetModel != null) {
			navTargetTitle = navTargetModel.title
		}

		let prevModel = (nextModel = null)
		if (NavUtil.canNavigate(this.state.navState)) {
			prevModel = NavUtil.getPrevModel(this.state.navState)
			if (prevModel) {
				let navText =
					typeof prevModel.title !== 'undefined' && prevModel.title !== null
						? 'Back: ' + prevModel.title
						: 'Back'
				prevEl = <InlineNavButton ref="prev" type="prev" title={`${navText}`} />
			} else {
				prevEl = (
					<InlineNavButton
						ref="prev"
						type="prev"
						title={`Start of ${this.state.model.title}`}
						disabled
					/>
				)
			}

			nextModel = NavUtil.getNextModel(this.state.navState)
			if (nextModel) {
				let navText =
					typeof nextModel.title !== 'undefined' && nextModel.title !== null
						? 'Next: ' + nextModel.title
						: 'Next'
				nextEl = <InlineNavButton ref="next" type="next" title={`${navText}`} />
			} else {
				nextEl = (
					<InlineNavButton
						ref="next"
						type="next"
						title={`End of ${this.state.model.title}`}
						disabled
					/>
				)
			}
		}

		let modalItem = ModalUtil.getCurrentModal(this.state.modalState)
		let hideViewer = modalItem && modalItem.hideViewer

		let classNames = [
			'viewer--viewer-app',
			'is-loaded',
			this.state.isPreviewing ? 'is-previewing' : 'is-not-previewing',
			this.state.navState.locked ? 'is-locked-nav' : 'is-unlocked-nav',
			this.state.navState.open ? 'is-open-nav' : 'is-closed-nav',
			this.state.navState.disabled ? 'is-disabled-nav' : 'is-enabled-nav',
			`is-focus-state-${this.state.focusState.viewState}`
		].join(' ')

		return (
			<IdleTimer
				ref="idleTimer"
				element={window}
				timeout={IDLE_TIMEOUT_DURATION_MS}
				idleAction={this.onIdle}
				activeAction={this.onReturnFromIdle}
			>
				<div
					ref="container"
					onMouseDown={this.onMouseDown.bind(this)}
					onScroll={this.onScroll.bind(this)}
					className={classNames}
				>
					{hideViewer ? null : (
						<header>
							<div className="pad">
								<span className="module-title">{this.state.model.title}</span>
								<span className="location">{navTargetTitle}</span>
								<Logo />
							</div>
						</header>
					)}
					{hideViewer ? null : <Nav navState={this.state.navState} />}
					{hideViewer ? null : prevEl}
					{hideViewer ? null : <ModuleComponent model={this.state.model} moduleData={this.state} />}
					{hideViewer ? null : nextEl}
					{this.state.isPreviewing ? (
						<div className="preview-banner">
							<span>You are previewing this module</span>
							<div className="controls">
								<span>Preview options:</span>
								<button
									onClick={this.unlockNavigation.bind(this)}
									disabled={!this.state.navState.locked}
								>
									Unlock navigation
								</button>
								<button
									className="button-clear-scores"
									onClick={this.clearPreviewScores.bind(this)}
								>
									Reset assessments &amp; questions
								</button>
							</div>
							<div className="border" />
						</div>
					) : null}
					<FocusBlocker moduleData={this.state} />
					{modalItem && modalItem.component ? (
						<ModalContainer>{modalItem.component}</ModalContainer>
					) : null}
				</div>
			</IdleTimer>
		)
	}
}
