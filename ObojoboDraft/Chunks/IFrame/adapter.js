export default {
	construct(model, attrs, s) {
		s('src', null)
		s('allow', null)
		s('width', null, p => parseInt(p, 10) || null)
		s('height', null, p => parseInt(p, 10) || null)
		s('scale', 1, p => parseFloat(p) || 1)
		s('border', false)
		s('newWindow', false, p => p === true)
		s('newWindowSrc', null)
		s('autoload', false, p => p === true)
		s('fit', 'scale', p => (p.toLowerCase() === 'scroll' ? 'scroll' : 'scale'))
		s('expandedSize', 'full', p => (p.toLowerCase() === 'restricted' ? 'restricted' : 'full'))
		s('expand', true, p => p === true)
		s('title', null)
		s('expandedScale', model.modelState.scale, p => parseFloat(p) || model.modelState.scale)
	},

	clone(model, clone) {
		//@TODO
		clone.modelState.src = model.modelState.src
		clone.modelState.allow = model.modelState.allow
	},

	toJSON(model, json) {
		json.content.src = model.modelState.src
		json.content.allow = model.modelState.allow
	},

	toText(model) {
		return model.modelState.src + ' ' + model.modelState.allow
	}
}
