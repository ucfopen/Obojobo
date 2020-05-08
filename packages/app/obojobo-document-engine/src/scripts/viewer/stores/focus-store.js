import Common from 'Common'

const { Store, Dispatcher } = Common.flux

/*
FocusStore allows you to specify items that you want browser focus to move to.
It doesn't modify any DOM focus and relies on the ViewerApp or OboNode components to handle this.
Additionally you can visually focus a component which will fade away all content except the
component to focus on.

The state has four possible values: `type`, `target`, `animateScroll` and `visualFocusTarget`

*	`type` is the type of focus.
*	`target` is the item to focus on.
*	`animateScroll` is a boolean - If true then the item to focus on should be smoothly scrolled to
	(again, it's up to ViewerApp to handle this).
*	`visualFocusTarget` is the id of the OboNode component to visually focus on (the content of the
	document should fade away except the visualFocusTarget component, resulting in highlighting that
	component - The actual effect is left to ViewerApp to handle).

Values for `type`:
*	TYPE_COMPONENT: Focus on an OboNode component. `target` should be the id. If that component has
	a `focusOnContent` method it will be called, otherwise the DOM element of the OboNode will be
	focused. Actually setting the DOM focus is left to ViewerApp. The `focusOnContent` method is
	expected to set the browser focus to the top-most item of the component.
*	TYPE_NAV_TARGET: Same as above except the component that is being focused will be the current
	nav target (In other words, this means focus on whatever the user is currently looking at).
	`target` should be `null`.
*	TYPE_VIEWER: This is reserved for focusing on some element of the viewer UI. The `target` should
	be a valid string describing what part of the UI to focus on. The only valid target currently is
	VIEWER_TARGET_NAVIGATION which means set focus to the viewer navigation. ViewerApp handles
	setting the actual DOM focus.
*/

const TYPE_VIEWER = 'viewer'
const TYPE_COMPONENT = 'component'
const TYPE_NAV_TARGET = 'navTarget'

const VIEWER_TARGET_NAVIGATION = 'navigation'

class FocusStore extends Store {
	constructor() {
		super('focusStore')

		Dispatcher.on('focus:navTarget', this._focusOnNavTarget.bind(this))
		Dispatcher.on('focus:navigation', this._focusOnNavigation.bind(this))
		Dispatcher.on('focus:component', payload => {
			this._focusComponent(
				payload.value.id,
				payload.value.scroll,
				payload.value.animateScroll,
				payload.value.fade
			)
		})
		Dispatcher.on('focus:clearFadeEffect', this._clearFadeEffect.bind(this))
	}

	init() {
		this.state = {
			target: null,
			type: null,
			scroll: true,
			animateScroll: false,
			visualFocusTarget: null
		}
	}

	_updateFocusTarget(type, target = null, scroll = true, animateScroll = false) {
		this.state.type = type
		this.state.target = target
		this.state.scroll = ('' + scroll).toLowerCase() === 'true'
		this.state.animateScroll = ('' + animateScroll).toLowerCase() === 'true'
		this.state.visualFocusTarget = null
	}

	_focusOnNavTarget() {
		this._updateFocusTarget(TYPE_NAV_TARGET)
		this.triggerChange()
	}

	_focusComponent(id, scroll = true, animateScroll = false, fade = false) {
		this._updateFocusTarget(TYPE_COMPONENT, id, scroll, animateScroll)
		this.state.visualFocusTarget = fade ? id : null
		this.triggerChange()
	}

	_focusOnNavigation() {
		this._updateFocusTarget(TYPE_VIEWER, VIEWER_TARGET_NAVIGATION)
		this.triggerChange()
	}

	_clearFadeEffect() {
		this.state.visualFocusTarget = null
		this.triggerChange()
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

const focusStore = new FocusStore()

// Export constants:
focusStore.TYPE_COMPONENT = TYPE_COMPONENT
focusStore.TYPE_NAV_TARGET = TYPE_NAV_TARGET
focusStore.TYPE_VIEWER = TYPE_VIEWER

focusStore.VIEWER_TARGET_NAVIGATION = VIEWER_TARGET_NAVIGATION

export default focusStore
