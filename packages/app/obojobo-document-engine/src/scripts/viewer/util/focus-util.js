import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const FocusUtil = {
	focusComponent(
		id,
		opts = { fade: false, animateScroll: false, preventScroll: false, region: null }
	) {
		Dispatcher.trigger('focus:component', {
			value: {
				id,
				fade: opts.fade || false,
				// scroll: typeof opts.scroll !== 'undefined' ? opts.scroll : true,
				region: opts.region || null,
				animateScroll: opts.animateScroll || false,
				preventScroll: opts.preventScroll || false
			}
		})
	},

	focusOnNavTarget() {
		Dispatcher.trigger('focus:navTarget')
	},

	focusOnNavigation() {
		Dispatcher.trigger('focus:navigation')
	},

	clearFadeEffect() {
		Dispatcher.trigger('focus:clearFadeEffect')
	},

	getFocussedItem(state) {
		return {
			type: state.type,
			target: state.target,
			options: {
				animateScroll: state.animateScroll,
				// scroll: state.scroll,
				fade: state.visualFocusTarget !== null && state.visualFocusTarget === state.target,
				region: state.region,
				preventScroll: state.preventScroll
			}
		}
	},

	getFocussedItemAndClear(state) {
		const item = FocusUtil.getFocussedItem(state)

		state.type = null
		state.target = null
		state.scroll = true
		state.animateScroll = false
		state.region = null
		state.visualFocusTarget = null

		return item
	},

	getVisuallyFocussedModel(state) {
		const targetId = state.visualFocusTarget
		if (!targetId) return null

		return OboModel.models[targetId] || null
	}
}

export default FocusUtil
