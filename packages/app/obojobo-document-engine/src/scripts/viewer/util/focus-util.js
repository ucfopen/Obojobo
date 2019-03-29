import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const FocusUtil = {
	focusOnContent(id, isVisuallyFocused = false) {
		Dispatcher.trigger('focus:content', {
			value: { id, isVisuallyFocused }
		})
	},

	focusComponent(id, isVisuallyFocused = true) {
		Dispatcher.trigger('focus:component', {
			value: { id, isVisuallyFocused }
		})
	},

	focusOnNavTargetContent() {
		Dispatcher.trigger('focus:navTargetContent')
	},

	focusOnNavigation() {
		Dispatcher.trigger('focus:navigation')
	},

	clearVisualFocus() {
		Dispatcher.trigger('focus:clearVisualFocus')
	},

	getFocussedItem(state) {
		return {
			type: state.type,
			target: state.target
		}
	},

	getFocussedItemAndClear(state) {
		const item = FocusUtil.getFocussedItem(state)

		state.type = null
		state.target = null

		return item
	},

	getVisuallyFocussedModel(state) {
		const targetId = state.visualFocusTarget
		if (!targetId) return null

		return OboModel.models[targetId] || null
	}
}

export default FocusUtil
