import Common from 'Common'

let { OboModel } = Common.models

let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.width) == 'large') {
			model.modelState.width = attrs.content.width
		} else {
			model.modelState.width = 'normal'
		}
	},

	toText(model) {
		return '---'
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
