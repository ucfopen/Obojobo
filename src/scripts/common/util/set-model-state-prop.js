export default (
	model,
	attrs,
	propName,
	defaultValue,
	getPropValueFn = p => p,
	allowedValues = null
) => {
	model.modelState[propName] = null

	if (attrs && attrs.content && typeof attrs.content[propName] !== 'undefined') {
		let propValue = getPropValueFn(attrs.content[propName])

		if (allowedValues === null || allowedValues.indexOf(propValue) > -1) {
			model.modelState[propName] = propValue
		}
	}

	if (model.modelState[propName] === null) {
		model.modelState[propName] = defaultValue
	}
}
