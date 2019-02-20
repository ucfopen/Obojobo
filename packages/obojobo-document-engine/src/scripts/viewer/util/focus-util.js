import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const FocusUtil = {
	focusComponent(id, opts = { fade: false, animateScroll: false }) {
		Dispatcher.trigger('focus:component', {
			value: {
				id,
				fade: opts.fade || false,
				animateScroll: opts.animateScroll || false
			}
		})
	},

	focusOnNavTarget(opts = { fade: false, animateScroll: false }) {
		Dispatcher.trigger('focus:navTarget', {
			fade: opts.fade || false,
			animateScroll: opts.animateScroll || false
		})
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
			animateScroll: state.animateScroll
		}
	},

	getFocussedItemAndClear(state) {
		const item = FocusUtil.getFocussedItem(state)

		state.type = null
		state.target = null
		state.animateScroll = false

		return item
	},

	getVisuallyFocussedModel(state) {
		const targetId = state.visualFocusTarget
		if (!targetId) return null

		return OboModel.models[targetId] || null
	}
}

export default FocusUtil
