import Common from 'Common'

const { OboModel } = Common.models
const { TextGroupAdapter } = Common.chunk.textChunk

const SIZES = ['small', 'standard', 'large']

const Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)
		model.modelState.textGroup.maxItems = 1

		if (
			attrs &&
			attrs.content &&
			attrs.content.size &&
			SIZES.indexOf(attrs.content.size.toLowerCase()) > -1
		) {
			model.modelState.size = attrs.content.size.toLowerCase()
		} else {
			model.modelState.size = 'standard'
		}

		if (attrs && attrs.content && attrs.content.border === true) {
			model.modelState.border = true
		} else {
			model.modelState.border = false
		}

		model.modelState.chartConfiguration = null
		if (attrs && attrs.content && attrs.content.chartConfiguration) {
			model.modelState.chartConfiguration = attrs.content.chartConfiguration
		}
	},

	toText(model) {
		return '[Chart]'
	}
}

export default Adapter
