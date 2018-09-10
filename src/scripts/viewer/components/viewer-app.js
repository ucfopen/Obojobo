import '../../../scss/main.scss'
import './viewer-app.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import Common from 'Common'
import IdleTimer from 'react-idle-timer'

import InlineNavButton from '../../viewer/components/inline-nav-button'
import NavUtil from '../../viewer/util/nav-util'
import APIUtil from '../../viewer/util/api-util'
import QuestionStore from '../../viewer/stores/question-store'
import AssessmentStore from '../../viewer/stores/assessment-store'
import NavStore from '../../viewer/stores/nav-store'
import MediaStore from '../../viewer/stores/media-store'
import Nav from './nav'
import getLTIOutcomeServiceHostname from '../../viewer/util/get-lti-outcome-service-hostname'
import Header from '../../viewer/components/header'

const IDLE_TIMEOUT_DURATION_MS = 600000 // 10 minutes
const NAV_CLOSE_DURATION_MS = 400

const { DOMUtil } = Common.page
const { Screen } = Common.page
const { OboModel } = Common.models
const { Dispatcher } = Common.flux
const { ModalContainer } = Common.components
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util
const { FocusBlocker } = Common.components
const { ModalStore } = Common.stores
const { FocusStore } = Common.stores
const { FocusUtil } = Common.util

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
			ReactDOM.findDOMNode(this.refs.container).scrollTop = payload.value
		})
		Dispatcher.on('viewer:scrollToTop', this.scrollToTop.bind(this))
		Dispatcher.on('getTextForVariable', this.getTextForVariable.bind(this))

		const state = {
			model: null,
			navState: null,
			mediaState: null,
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
		this.onMediaStoreChange = () => this.setState({ mediaState: MediaStore.getState() })

		this.onIdle = this.onIdle.bind(this)
		this.onReturnFromIdle = this.onReturnFromIdle.bind(this)
		this.onBeforeWindowClose = this.onBeforeWindowClose.bind(this)
		this.onWindowClose = this.onWindowClose.bind(this)
		this.onVisibilityChange = this.onVisibilityChange.bind(this)

		this.state = state

		// === SET UP DATA STORES ===
		NavStore.onChange(this.onNavStoreChange)
		QuestionStore.onChange(this.onQuestionStoreChange)
		AssessmentStore.onChange(this.onAssessmentStoreChange)
		ModalStore.onChange(this.onModalStoreChange)
		FocusStore.onChange(this.onFocusStoreChange)
		MediaStore.onChange(this.onMediaStoreChange)
	}

	componentDidMount() {
		document.addEventListener('visibilitychange', this.onVisibilityChange)

		let visitIdFromApi
		let attemptHistory
		let viewState
		let isPreviewing
		let outcomeServiceURL = 'the external system'

		const urlTokens = document.location.pathname.split('/')
		const visitIdFromUrl = urlTokens[4] ? urlTokens[4] : null
		const draftIdFromUrl = urlTokens[2] ? urlTokens[2] : null

		Dispatcher.trigger('viewer:loading')

		APIUtil.requestStart(visitIdFromUrl, draftIdFromUrl)
			.then(visit => {
				QuestionStore.init()
				ModalStore.init()
				FocusStore.init()
				MediaStore.init()

				if (visit.status !== 'ok') throw 'Invalid Visit Id'

				visitIdFromApi = visit.value.visitId
				viewState = visit.value.viewState
				attemptHistory = visit.value.extensions[':ObojoboDraft.Sections.Assessment:attemptHistory']
				isPreviewing = visit.value.isPreviewing
				outcomeServiceURL = visit.value.lti.lisOutcomeServiceUrl

				return APIUtil.getDraft(draftIdFromUrl)
			})
			.then(({ value: draftModel }) => {
				const model = OboModel.create(draftModel)

				// console.log('model', draftModel, model)

				NavStore.init(
					model,
					model.modelState.start,
					window.location.pathname,
					visitIdFromApi,
					viewState
				)
				AssessmentStore.init(attemptHistory)

				this.setState({
					model,
					navState: NavStore.getState(),
					mediaState: MediaStore.getState(),
					questionState: QuestionStore.getState(),
					assessmentState: AssessmentStore.getState(),
					modalState: ModalStore.getState(),
					focusState: FocusStore.getState(),
					lti: Object.assign(this.state.lti, {
						outcomeServiceHostname: getLTIOutcomeServiceHostname(outcomeServiceURL)
					})
				})

				window.onbeforeunload = this.onBeforeWindowClose
				window.onunload = this.onWindowClose
				window.onresize = this.onResize.bind(this)

				this.boundOnDelayResize = this.onDelayResize.bind(this)
				Dispatcher.on('nav:open', this.boundOnDelayResize)
				Dispatcher.on('nav:close', this.boundOnDelayResize)
				Dispatcher.on('nav:toggle', this.boundOnDelayResize)

				this.setState({ loading: false, requestStatus: 'ok', isPreviewing }, () => {
					Dispatcher.trigger('viewer:loaded', true)
				})
			})
			.catch(err => {
				console.error(err) /* eslint-disable-line no-console */
				this.setState({ loading: false, requestStatus: 'invalid' }, () =>
					Dispatcher.trigger('viewer:loaded', false)
				)
			})
	}

	componentWillUnmount() {
		NavStore.offChange(this.onNavStoreChange)
		QuestionStore.offChange(this.onQuestionStoreChange)
		AssessmentStore.offChange(this.onAssessmentStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
		FocusStore.offChange(this.onFocusStoreChange)
		MediaStore.offChange(this.onMediaStoreChange)

		document.removeEventListener('visibilitychange', this.onVisibilityChange)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !nextState.loading
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.requestStatus === 'ok') {
			const navTargetId = this.state.navTargetId
			const nextNavTargetId = this.state.navState.navTargetId

			if (navTargetId !== nextNavTargetId) {
				this.needsScroll = true
				return this.setState({ navTargetId: nextNavTargetId })
			}
		}

		if (this.state.loading && !nextState.loading) {
			this.needsRemoveLoadingElement = true
		}
	}

	componentDidUpdate() {
		if (this.state.requestStatus === 'ok') {
			if (this.lastCanNavigate !== NavUtil.canNavigate(this.state.navState)) {
				this.needsScroll = true
			}
			this.lastCanNavigate = NavUtil.canNavigate(this.state.navState)
			if (this.needsScroll) {
				this.scrollToTop()

				delete this.needsScroll
			}
		}

		if (this.needsRemoveLoadingElement === true) {
			const loadingEl = document.getElementById('viewer-app-loading')
			if (loadingEl && loadingEl.parentElement) {
				document.getElementById('viewer-app').classList.add('is-loaded')
				loadingEl.parentElement.removeChild(loadingEl)

				delete this.needsRemoveLoadingElement
			}
		}
	}

	onVisibilityChange() {
		if (document.hidden) {
			APIUtil.postEvent({
				draftId: this.state.model.get('draftId'),
				action: 'viewer:leave',
				eventVersion: '1.0.0',
				visitId: this.state.navState.visitId
			}).then(res => {
				this.leaveEvent = res.value
			})
		} else {
			APIUtil.postEvent({
				draftId: this.state.model.get('draftId'),
				action: 'viewer:return',
				eventVersion: '1.0.0',
				visitId: this.state.navState.visitId,
				payload: {
					relatedEventId: this.leaveEvent.id
				}
			})
			delete this.leaveEvent
		}
	}

	getTextForVariable(event, variable, textModel) {
		return (event.text = Common.Store.getTextForVariable(variable, textModel, this.state))
	}

	scrollToTop() {
		const el = ReactDOM.findDOMNode(this.refs.prev)
		const container = ReactDOM.findDOMNode(this.refs.container)

		if (!container) return

		if (el) {
			return (container.scrollTop = el.getBoundingClientRect().height)
		}

		return (container.scrollTop = 0)
	}

	// === NON REACT LIFECYCLE METHODS ===

	onMouseDown(event) {
		const focusState = this.state.focusState

		if (focusState.focussedId === null || typeof focusState.focussedId === 'undefined') {
			return
		}
		if (!DOMUtil.findParentComponentIds(event.target).has(focusState.focussedId)) {
			return FocusUtil.unfocus()
		}
	}

	onScroll() {
		const focusState = this.state.focusState

		if (!focusState.focussedId) {
			return
		}

		const component = FocusUtil.getFocussedComponent(focusState)
		if (!component) {
			return
		}

		const el = component.getDomEl()
		if (!el) {
			return
		}

		if (!Screen.isElementVisible(el)) {
			return FocusUtil.unfocus()
		}
	}

	onResize() {
		Dispatcher.trigger(
			'viewer:contentAreaResized',
			ReactDOM.findDOMNode(this.refs.container).getBoundingClientRect().width
		)
	}

	onDelayResize() {
		window.setTimeout(this.onResize.bind(this), NAV_CLOSE_DURATION_MS)
	}

	onIdle() {
		this.lastActiveEpoch = new Date(this.refs.idleTimer.getLastActiveTime())

		APIUtil.postEvent({
			draftId: this.state.model.get('draftId'),
			action: 'viewer:inactive',
			eventVersion: '3.0.0',
			payload: {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: IDLE_TIMEOUT_DURATION_MS
			}
		}).then(res => {
			this.inactiveEvent = res.value
		})
	}

	onReturnFromIdle() {
		APIUtil.postEvent({
			draftId: this.state.model.get('draftId'),
			action: 'viewer:returnFromInactive',
			eventVersion: '2.0.0',
			visitId: this.state.navState.visitId,
			payload: {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: Date.now() - this.lastActiveEpoch,
				relatedEventId: this.inactiveEvent.id
			}
		})

		delete this.lastActiveEpoch
		delete this.inactiveEvent
	}

	onBeforeWindowClose() {
		let closePrevented = false
		// calling this function will prevent the window from closing
		const preventClose = () => {
			closePrevented = true
		}

		Dispatcher.trigger('viewer:closeAttempted', preventClose)

		if (closePrevented) {
			return true // Returning true will cause browser to ask user to confirm leaving page
		}

		/* eslint-disable-next-line */
		return undefined // Returning undefined will allow browser to close normally
	}

	onWindowClose() {
		APIUtil.postEvent({
			draftId: this.state.model.get('draftId'),
			action: 'viewer:close',
			eventVersion: '1.0.0',
			visitId: this.state.navState.visitId
		})
	}

	clearPreviewScores() {
		APIUtil.clearPreviewScores({
			draftId: this.state.model.get('draftId'),
			visitId: this.state.navState.visitId
		}).then(res => {
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
		if (this.state.loading) return null

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

		let nextComp, nextModel, prevComp
		window.__lo = this.state.model
		window.__s = this.state

		const ModuleComponent = this.state.model.getComponentClass()

		const navTargetModel = NavUtil.getNavTargetModel(this.state.navState)
		let navTargetTitle = '?'
		if (navTargetModel && navTargetModel.title) {
			navTargetTitle = navTargetModel.title
		}

		let prevModel = (nextModel = null)
		if (NavUtil.canNavigate(this.state.navState)) {
			prevModel = NavUtil.getPrevModel(this.state.navState)
			if (prevModel) {
				const navText =
					typeof prevModel.title !== 'undefined' && prevModel.title !== null
						? 'Back: ' + prevModel.title
						: 'Back'
				prevComp = <InlineNavButton ref="prev" type="prev" title={`${navText}`} />
			} else {
				prevComp = (
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
				const navText =
					typeof nextModel.title !== 'undefined' && nextModel.title !== null
						? 'Next: ' + nextModel.title
						: 'Next'
				nextComp = <InlineNavButton ref="next" type="next" title={`${navText}`} />
			} else {
				nextComp = (
					<InlineNavButton
						ref="next"
						type="next"
						title={`End of ${this.state.model.title}`}
						disabled
					/>
				)
			}
		}

		const modalItem = ModalUtil.getCurrentModal(this.state.modalState)
		const hideViewer = modalItem && modalItem.hideViewer

		const classNames = [
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
						<Header moduleTitle={this.state.model.title} location={navTargetTitle} />
					)}
					{hideViewer ? null : <Nav navState={this.state.navState} />}
					{hideViewer ? null : prevComp}
					{hideViewer ? null : <ModuleComponent model={this.state.model} moduleData={this.state} />}
					{hideViewer ? null : nextComp}
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
