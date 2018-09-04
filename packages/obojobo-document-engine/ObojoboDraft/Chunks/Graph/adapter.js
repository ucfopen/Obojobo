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

		if (attrs && attrs.content && attrs.content.border === false) {
			model.modelState.border = false
		} else {
			model.modelState.border = true
		}

		if (attrs && attrs.content && attrs.content.navigation === true) {
			model.modelState.navigation = true
		} else {
			model.modelState.navigation = false
		}

		if (attrs && attrs.content && attrs.content.function) {
			model.modelState.function = attrs.content.function
		} else {
			model.modelState.function = null
		}

		if (attrs && attrs.content && attrs.content.height) {
			model.modelState.height = attrs.content.height
		} else {
			model.modelState.height = null
		}

		//axis, bounding box
		model.modelState.topLeft = [-5, 5]
		if (attrs && attrs.content && attrs.content.topLeft) {
			const tl = ('' + attrs.content.topLeft)
				.split(',')
				.map(n => parseFloat(n))
				.filter(n => Number.isFinite(n))
			if (tl.length <= 2) model.modelState.topLeft = tl
		}

		model.modelState.bottomRight = [5, -5]
		if (attrs && attrs.content && attrs.content.bottomRight) {
			const br = ('' + attrs.content.bottomRight)
				.split(',')
				.map(n => parseFloat(n))
				.filter(n => Number.isFinite(n))
			if (br.length <= 2) model.modelState.bottomRight = br
		}

		if (attrs && attrs.content && attrs.content.axis === false) {
			model.modelState.axis = false
		} else {
			model.modelState.axis = true
		}
	},

	toText(model) {
		return '[Graph]'
	}
}

export default Adapter
