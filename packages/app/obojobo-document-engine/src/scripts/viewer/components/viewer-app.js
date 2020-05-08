import '../../../scss/main.scss'
import './viewer-app.scss'

import APIUtil from '../util/api-util'
import AssessmentStore from '../stores/assessment-store'
import Common from 'Common'
import FocusStore from '../stores/focus-store'
import FocusUtil from '../util/focus-util'
import Header from './header'
import IdleTimer from 'react-idle-timer'
import InlineNavButton from './inline-nav-button'
import MediaStore from '../stores/media-store'
import Nav from './nav'
import NavStore from '../stores/nav-store'
import NavUtil from '../util/nav-util'
import QuestionStore from '../stores/question-store'
import React from 'react'
import ReactDOM from 'react-dom'
import VariableStore from '../stores/variable-store'
import getLTIOutcomeServiceHostname from '../util/get-lti-outcome-service-hostname'

const IDLE_TIMEOUT_DURATION_MS = 60000 * 10 // 10 minutes
const NAV_CLOSE_DURATION_MS = 400

const { DOMUtil, focus } = Common.page
const { OboModel } = Common.models
const { Dispatcher } = Common.flux
const { FocusBlocker, ModalContainer } = Common.components
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util
const { ModalStore } = Common.stores

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

		this.navRef = React.createRef()
		this.nextRef = React.createRef()
		this.prevRef = React.createRef()
		this.containerRef = React.createRef()
		this.idleTimerRef = React.createRef()

		Dispatcher.on('viewer:scrollToTop', payload => {
			this.scrollToTop(payload && payload.value ? payload.value.animateScroll : false)
		})
		Dispatcher.on('getTextForVariable', this.getTextForVariable.bind(this))

		const state = {
			model: null,
			navState: null,
			mediaState: null,
			questionState: null,
			assessmentState: null,
			modalState: null,
			focusState: null,
			loading: true,
			requestStatus: 'unknown',
			isPreviewing: false,
			lti: { outcomeServiceHostname: null },
			viewSessionId: null
		}
		this.navTargetId = null
		this.onNavStoreChange = () => this.setState({ navState: NavStore.getState() })
		this.onQuestionStoreChange = () => this.setState({ questionState: QuestionStore.getState() })
		this.onAssessmentStoreChange = () =>
			this.setState({
				assessmentState: AssessmentStore.getState()
			})
		this.onModalStoreChange = () =>
			this.setState({
				modalState: ModalStore.getState()
			})
		this.onFocusStoreChange = () =>
			this.setState({
				focusState: FocusStore.getState()
			})
		this.onMediaStoreChange = () =>
			this.setState({
				mediaState: MediaStore.getState()
			})
		this.onVariableStoreChange = () =>
			this.setState({
				variableState: VariableStore.getState()
			})

		this.onIdle = this.onIdle.bind(this)
		this.onReturnFromIdle = this.onReturnFromIdle.bind(this)
		this.onBeforeWindowClose = this.onBeforeWindowClose.bind(this)
		this.sendCloseEvent = this.sendCloseEvent.bind(this)
		this.onVisibilityChange = this.onVisibilityChange.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onFocus = this.onFocus.bind(this)
		this.onScroll = this.onScroll.bind(this)
		this.onResize = this.onResize.bind(this)
		this.unlockNavigation = this.unlockNavigation.bind(this)
		this.clearPreviewScores = this.clearPreviewScores.bind(this)

		this.state = state

		// === SET UP DATA STORES ===
		NavStore.onChange(this.onNavStoreChange)
		QuestionStore.onChange(this.onQuestionStoreChange)
		AssessmentStore.onChange(this.onAssessmentStoreChange)
		ModalStore.onChange(this.onModalStoreChange)
		FocusStore.onChange(this.onFocusStoreChange)
		MediaStore.onChange(this.onMediaStoreChange)
		VariableStore.onChange(this.onVariableStoreChange)
	}

	componentDidMount() {
		document.addEventListener('visibilitychange', this.onVisibilityChange)

		let visitIdFromApi
		let attemptHistory
		let viewState
		let isPreviewing
		let outcomeServiceURL = 'the external system'
		let viewSessionId

		Dispatcher.trigger('viewer:loading')

		APIUtil.requestStart(this.props.visitId, this.props.draftId)
			.then(visit => {
				QuestionStore.init()
				ModalStore.init()
				FocusStore.init()
				MediaStore.init()
				VariableStore.init()

				if (visit.status !== 'ok') throw 'Invalid Visit Id'

				visitIdFromApi = visit.value.visitId
				viewState = visit.value.viewState
				attemptHistory = visit.value.extensions[':ObojoboDraft.Sections.Assessment:attemptHistory']
				isPreviewing = visit.value.isPreviewing
				outcomeServiceURL = visit.value.lti.lisOutcomeServiceUrl

				return APIUtil.getDraft(this.props.draftId)
			})
			.then(({ value: draftModel }) => {
				const model = OboModel.create(draftModel)

				NavStore.init(
					OboModel.getRoot().get('draftId'),
					model,
					model.modelState.start,
					window.location.pathname,
					visitIdFromApi,
					viewState
				)
				AssessmentStore.init(attemptHistory)

				window.onbeforeunload = this.onBeforeWindowClose
				window.onresize = this.onResize

				this.boundOnDelayResize = this.onDelayResize.bind(this)
				Dispatcher.on('nav:open', this.boundOnDelayResize)
				Dispatcher.on('nav:close', this.boundOnDelayResize)
				Dispatcher.on('nav:toggle', this.boundOnDelayResize)

				this.setState(
					{
						model,
						navState: NavStore.getState(),
						mediaState: MediaStore.getState(),
						questionState: QuestionStore.getState(),
						assessmentState: AssessmentStore.getState(),
						modalState: ModalStore.getState(),
						focusState: FocusStore.getState(),
						variableState: VariableStore.getState(),
						lti: Object.assign(this.state.lti, {
							outcomeServiceHostname: getLTIOutcomeServiceHostname(outcomeServiceURL)
						}),
						loading: false,
						requestStatus: 'ok',
						isPreviewing,
						viewSessionId
					},
					() => Dispatcher.trigger('viewer:loaded', true)
				)
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
		VariableStore.offChange(this.onVariableStoreChange)

		document.removeEventListener('visibilitychange', this.onVisibilityChange)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !nextState.loading
	}

	isDOMFocusInsideNav() {
		if (!this.navRef.current) {
			return false
		}
		/* eslint-disable-next-line */
		return ReactDOM.findDOMNode(this.navRef.current).contains(document.activeElement)
	}

	isNavTargetChanging(prevState) {
		return NavUtil.getNavTarget(prevState.navState) !== NavUtil.getNavTarget(this.state.navState)
	}

	scrollToTopIfNavTargetChanging(prevState) {
		if (this.isNavTargetChanging(prevState)) {
			this.scrollToTop()
		}
	}

	focusOnContentIfNavTargetChanging(prevState) {
		const focussedItem = FocusUtil.getFocussedItem(this.state.focusState)

		if (
			!this.isDOMFocusInsideNav() &&
			this.isNavTargetChanging(prevState) &&
			focussedItem.type === null
		) {
			FocusUtil.focusOnNavTarget()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// remove loading element
		if (prevState.loading && !this.state.loading) {
			const loadingEl = document.getElementById('viewer-app-loading')
			if (loadingEl && loadingEl.parentElement) {
				document.getElementById('viewer-app').classList.add('is-loaded')
				loadingEl.parentElement.removeChild(loadingEl)
				this.scrollToTop()
			}
		}

		if (this.state.requestStatus === 'invalid') return

		this.focusOnContentIfNavTargetChanging(prevState)
		this.scrollToTopIfNavTargetChanging(prevState)

		// use Focus Store values to update DOM Focus
		this.updateDOMFocus()
	}

	updateDOMFocus() {
		const focussedItem = FocusUtil.getFocussedItemAndClear(this.state.focusState)

		switch (focussedItem.type) {
			case FocusStore.TYPE_COMPONENT: {
				return this.focusComponent(OboModel.models[focussedItem.target], focussedItem.options)
			}

			case FocusStore.TYPE_NAV_TARGET: {
				return this.focusComponent(
					NavUtil.getNavTargetModel(this.state.navState),
					focussedItem.options
				)
			}

			case FocusStore.TYPE_VIEWER: {
				return this.focusViewer(focussedItem.target)
			}
		}

		return false
	}

	focusViewer(viewerFocusTarget) {
		switch (viewerFocusTarget) {
			case FocusStore.VIEWER_TARGET_NAVIGATION: {
				if (!NavUtil.isNavEnabled(this.state.navState) || !NavUtil.isNavOpen(this.state.navState)) {
					return false
				}

				this.navRef.current.focus()

				return true
			}
		}

		return false
	}

	focusComponent(model, opts) {
		if (!model) return false

		// Save the current scroll location since focus() will scroll the page (there is a
		// preventScroll option but it is not widely supported). Once focus is called we'll
		// quickly reset the scroll location to what it was before the focus. This allows
		// the smooth scroll to move from where the page was rather than scrolling from an
		// unexpected location.
		const currentScrollTop = this.containerRef.current.scrollTop
		const el = model.getDomEl()

		const Component = model.getComponentClass ? model.getComponentClass() : null

		if (Component && Component.focusOnContent) {
			Component.focusOnContent(model, opts)
		} else {
			focus(el, opts.scroll)
		}

		if (opts.scroll && opts.animateScroll) {
			this.containerRef.current.scrollTop = currentScrollTop
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}

		return true
	}

	onVisibilityChange() {
		if (document.hidden) {
			this.leftEpoch = new Date()

			APIUtil.postEvent({
				draftId: this.state.model.get('draftId'),
				action: 'viewer:leave',
				eventVersion: '1.0.0',
				visitId: this.state.navState.visitId
			}).then(result => {
				this.leaveEvent = result.response.value
			})
		} else {
			APIUtil.postEvent({
				draftId: this.state.model.get('draftId'),
				action: 'viewer:return',
				eventVersion: '2.0.0',
				visitId: this.state.navState.visitId,
				payload: {
					relatedEventId: this.leaveEvent.extensions.internalEventId,
					leftTime: this.leftEpoch,
					duration: Date.now() - this.leftEpoch
				}
			})

			delete this.leaveEvent
			delete this.leftEpoch
		}
	}

	getTextForVariable(event, varName, textModel) {
		let text = Common.Registry.getTextForVariable(varName, textModel, this.state)
		if (text) {
			event.text = text
			return
		}

		const results = textModel.getTextForVariable(varName)
		event.text = results.text
		event.style = results.style
	}

	scrollToTop(animateScroll = false) {
		if (!this.state.model || !this.state.model.getDomEl || !this.state.model.getDomEl()) {
			return false
		}

		if (animateScroll) {
			this.state.model.getDomEl().scrollIntoView({ behavior: 'smooth', block: 'start' })
		} else {
			this.state.model.getDomEl().scrollIntoView()
		}

		return true
	}

	// === NON REACT LIFECYCLE METHODS ===

	onMouseDown(event) {
		this.clearFadeEffect(event.target)
	}

	onFocus(event) {
		this.clearFadeEffect(event.target)
	}

	clearFadeEffect(el) {
		// When focusing on another element we want to remove
		// the focus effect if the element is not part of the focused element

		const visuallyFocussedModel = FocusUtil.getVisuallyFocussedModel(this.state.focusState)

		if (visuallyFocussedModel) {
			const focussedElement = visuallyFocussedModel.getDomEl()

			if (!focussedElement || !focussedElement.contains(el)) {
				FocusUtil.clearFadeEffect()
			}
		}
	}

	onScroll() {
		const focusState = this.state.focusState

		if (!focusState.visualFocusTarget) {
			return
		}

		const component = FocusUtil.getVisuallyFocussedModel(focusState)
		if (!component) {
			return
		}

		const el = component.getDomEl()
		if (!el) {
			return
		}
		if (!DOMUtil.isElementVisible(el)) {
			return FocusUtil.clearFadeEffect()
		}
	}

	onResize() {
		Dispatcher.trigger(
			'viewer:contentAreaResized',
			/* eslint-disable-next-line */
			ReactDOM.findDOMNode(this.containerRef.current).getBoundingClientRect().width
		)
	}

	onDelayResize() {
		window.setTimeout(this.onResize, NAV_CLOSE_DURATION_MS)
	}

	onIdle() {
		this.lastActiveEpoch = new Date(this.idleTimerRef.current.getLastActiveTime())

		APIUtil.postEvent({
			draftId: this.state.model.get('draftId'),
			action: 'viewer:inactive',
			eventVersion: '3.0.0',
			visitId: this.state.navState.visitId,
			payload: {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: IDLE_TIMEOUT_DURATION_MS
			}
		}).then(result => {
			this.inactiveEvent = result.response.value
		})
	}

	onReturnFromIdle() {
		APIUtil.postEvent({
			draftId: this.state.model.get('draftId'),
			action: 'viewer:returnFromInactive',
			eventVersion: '2.1.0',
			visitId: this.state.navState.visitId,
			payload: {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: Date.now() - this.lastActiveEpoch,
				relatedEventId: this.inactiveEvent.extensions.internalEventId
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

		this.sendCloseEvent()

		/* eslint-disable-next-line */
		return undefined // Returning undefined will allow browser to close normally
	}

	sendCloseEvent() {
		const body = {
			draftId: this.state.model.get('draftId'),
			visitId: this.state.navState.visitId,
			event: {
				action: 'viewer:close',
				draft_id: this.state.model.get('draftId'),
				actor_time: new Date().toISOString(),
				event_version: '1.0.0',
				visitId: this.state.navState.visitId
			}
		}

		navigator.sendBeacon('/api/events', JSON.stringify(body))
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
				<SimpleDialog ok width="19em">
					Assessment attempts and all question responses have been reset.
				</SimpleDialog>
			)
		})
	}

	unlockNavigation() {
		return NavUtil.unlock()
	}

	renderRequestStatusError() {
		const serviceName = this.state.lti.outcomeServiceHostname
			? this.state.lti.outcomeServiceHostname
			: 'the external system'

		return (
			<div className="viewer--viewer-app--visit-error">
				There was a problem starting your visit. Please return to {serviceName} and relaunch this
				module.
			</div>
		)
	}

	render() {
		if (this.state.loading) return null

		if (this.state.requestStatus === 'invalid') {
			return this.renderRequestStatusError()
		}

		let nextComp, nextItem, prevComp, prevItem
		window.__lo = this.state.model
		window.__s = this.state

		const ModuleComponent = this.state.model.getComponentClass()

		const navTargetItem = NavUtil.getNavTarget(this.state.navState)
		let navTargetLabel = ''
		if (navTargetItem && navTargetItem.label) {
			navTargetLabel = navTargetItem.label
		}

		const isNavEnabled = NavUtil.isNavEnabled(this.state.navState)

		const visuallyFocussedModel = FocusUtil.getVisuallyFocussedModel(this.state.focusState)

		if (isNavEnabled) {
			const canNavigate = NavUtil.canNavigate(this.state.navState)

			prevItem = NavUtil.getPrev(this.state.navState)
			if (prevItem) {
				const navText = prevItem.label ? 'Back: ' + prevItem.label : 'Back'
				const navLabel = prevItem.label ? 'Go back to ' + prevItem.label : 'Go back'
				prevComp = (
					<InlineNavButton
						ref={this.prevRef}
						type="prev"
						title={navText}
						ariaLabel={navLabel}
						disabled={!canNavigate}
					/>
				)
			} else {
				prevComp = (
					<InlineNavButton
						ref={this.prevRef}
						type="prev"
						title={`Start of ${this.state.model.title}`}
						ariaLabel={`This is the start of ${this.state.model.title}.`}
						disabled
					/>
				)
			}

			nextItem = NavUtil.getNext(this.state.navState)
			if (nextItem) {
				const navText = nextItem.label ? 'Next: ' + nextItem.label : 'Next'
				const navLabel = nextItem.label ? 'Go forward to ' + nextItem.label : 'Go forward'
				nextComp = (
					<InlineNavButton
						ref={this.nextRef}
						type="next"
						title={navText}
						ariaLabel={navLabel}
						disabled={!canNavigate}
					/>
				)
			} else {
				nextComp = (
					<InlineNavButton
						ref={this.nextRef}
						type="next"
						title={`End of ${this.state.model.title}`}
						ariaLabel={`You have reached the end of ${this.state.model.title}.`}
						disabled
					/>
				)
			}
		}

		const modalItem = ModalUtil.getCurrentModal(this.state.modalState)
		const hideViewer = modalItem && modalItem.hideViewer

		const classNames = [
			'viewer--viewer-app',
			this.state.isPreviewing ? 'is-previewing' : 'is-not-previewing',
			this.state.navState.locked ? 'is-locked-nav' : 'is-unlocked-nav',
			this.state.navState.open ? 'is-open-nav' : 'is-closed-nav',
			this.state.navState.disabled ? 'is-disabled-nav' : 'is-enabled-nav',
			visuallyFocussedModel ? 'is-focus-state-active' : 'is-focus-state-inactive'
		].join(' ')

		return (
			<div
				ref={this.containerRef}
				onMouseDown={this.onMouseDown}
				onFocus={this.onFocus}
				onScroll={this.onScroll}
				className={classNames}
			>
				<IdleTimer
					ref={this.idleTimerRef}
					element={window}
					timeout={IDLE_TIMEOUT_DURATION_MS}
					onIdle={this.onIdle}
					onActive={this.onReturnFromIdle}
				/>
				{hideViewer ? null : (
					<Header moduleTitle={this.state.model.title} location={navTargetLabel} />
				)}
				{hideViewer ? null : <Nav ref={this.navRef} navState={this.state.navState} />}
				{hideViewer ? null : prevComp}
				{hideViewer ? null : <ModuleComponent model={this.state.model} moduleData={this.state} />}
				{hideViewer ? null : nextComp}
				{this.state.isPreviewing ? (
					<div className="preview-banner">
						<span>Preview mode</span>
						<div className="controls">
							<span>Preview options:</span>
							<button onClick={this.unlockNavigation} disabled={!this.state.navState.locked}>
								Unlock navigation
							</button>
							<button className="button-clear-scores" onClick={this.clearPreviewScores}>
								Reset assessments &amp; questions
							</button>
						</div>
						<div className="border" />
					</div>
				) : null}
				<FocusBlocker moduleData={this.state} />
				{/* {true || (modalItem && modalItem.component) ? ( */}
				{/* // <ModalContainer>{modalItem.component}</ModalContainer> */}
				<ModalContainer modalItem={modalItem} />
				{/* ) : null} */}
			</div>
		)
	}
}
