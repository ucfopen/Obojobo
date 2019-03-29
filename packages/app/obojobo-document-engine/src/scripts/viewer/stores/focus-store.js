import Common from 'Common'

const { Store, Dispatcher } = Common.flux

/*
FocusStore allows you to specify items that you want browser focus to move to.
It doesn't modify any DOM focus and relies on the ViewerApp or OboNode components to handle this.
Additionally you can visually focus a component which will fade away all content except the
component to focus on.

The state has three values: `type`, `target` and `visualFocusTarget`

`type` is the type of focus and `target` is the item to focus on. `visualFocusTarget` is the id of
the OboNode component to visually focus on (the content of the document should fade away except the
visualFocusTarget component, resulting in highlighting that component - The actual effect is left
to ViewerApp to handle).

Values for `type`:
*	TYPE_COMPONENT: Focus on the DOM element of a OboNode component. `target` should be the id
	of the OboModel to focus on. Actually setting the DOM focus is left to ViewerApp.
* 	TYPE_CONTENT: Focus on the first part of the inner content of a component. This will call
	that component's static `focusOnContent` method (if it exists) which is responsible for
	setting the DOM focus. `target` should be the id of the OboModel to call focusOnContent on.
*	TYPE_NAV_TARGET_CONTENT: Same as above except the component whose `focusOnContent` method will
	be envoked should be the current nav target (In other words, this means focus on the content
	for whatever the user is currently looking at). `target` should be `null`.
*	TYPE_VIEWER: This is reserved for focusing on some element of the viewer UI. The `target` should
	be a valid string describing what part of the UI to focus on. The only valid target currently is
	VIEWER_TARGET_NAVIGATION which means set focus to the viewer navigation. ViewerApp handles
	setting the actual DOM focus.
*/

const TYPE_VIEWER = 'viewer'
const TYPE_COMPONENT = 'component'
const TYPE_CONTENT = 'content'
const TYPE_NAV_TARGET_CONTENT = 'navTargetContent'

const VIEWER_TARGET_NAVIGATION = 'navigation'

class FocusStore extends Store {
	constructor() {
		super('focusStore')

		Dispatcher.on('focus:navTargetContent', this._focusOnNavTargetContent.bind(this))
		Dispatcher.on('focus:content', payload => {
			this._focusOnContent(payload.value.id, payload.value.isVisuallyFocused)
		})
		Dispatcher.on('focus:navigation', this._focusOnNavigation.bind(this))
		Dispatcher.on('focus:component', payload => {
			this._focusComponent(payload.value.id, payload.value.isVisuallyFocused)
		})
		Dispatcher.on('focus:clearVisualFocus', this._clearVisualFocus.bind(this))
	}

	init() {
		this.state = {
			target: null,
			type: null,
			visualFocusTarget: null
		}
	}

	_updateFocusTarget(type, target = null) {
		this.state.type = type
		this.state.target = target
	}

	_updateVisualFocus(componentId) {
		this.state.visualFocusTarget = componentId
	}

	_focusOnNavTargetContent() {
		this._updateFocusTarget(TYPE_NAV_TARGET_CONTENT)
		this.triggerChange()
	}

	_focusOnContent(id, isVisuallyFocused = true) {
		this._updateFocusTarget(TYPE_CONTENT, id)
		if (isVisuallyFocused) {
			this._updateVisualFocus(id)
		}

		this.triggerChange()
	}

	_focusComponent(id, isVisuallyFocused = true) {
		this._updateFocusTarget(TYPE_COMPONENT, id)

		if (isVisuallyFocused) {
			this._updateVisualFocus(id)
		}

		this.triggerChange()
	}

	_focusOnNavigation() {
		this._updateFocusTarget(TYPE_VIEWER, VIEWER_TARGET_NAVIGATION)

		this.triggerChange()
	}

	_clearVisualFocus() {
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
focusStore.TYPE_CONTENT = TYPE_CONTENT
focusStore.TYPE_NAV_TARGET_CONTENT = TYPE_NAV_TARGET_CONTENT
focusStore.TYPE_VIEWER = TYPE_VIEWER

focusStore.VIEWER_TARGET_NAVIGATION = VIEWER_TARGET_NAVIGATION

export default focusStore
