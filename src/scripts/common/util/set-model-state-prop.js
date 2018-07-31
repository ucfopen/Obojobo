/*
Filters the values used in OBONode models

pulls data from `attrs.content` in the document and sets them in `model.modelState` based on a set of rules

//// Usage Example:

// import util method
const setModelStateProp = Common.util.setModelStateProp

// bind the OboNode adapter to the method for convenience
const setProp = setModelStateProp.bind(this, model, attrs)

// setProp(propName, defaultValue, getPropValueFn, allowedValues)
setProp('type', 'media', p => (p.toLowerCase() === 'webpage' ? 'webpage' : 'media'), ['webpage', 'media'])

//// arguments

propName is the property from from `attrs.content`, in our example: `attrs.content.type`
.
defaultValue is used if:
 1. `attrs.content.type` is null or undefined
 2. getPropValueFn returns null
 3. getPropValueFn returns a value that isnt in allowedValues (if set)

getPropValueFN is used to alter the incoming value of `attrs.content.type` before it's tested against allowed values. `p` set to the value of `attrs.content.type`

allowedValues is an array of the only valid values.  If, after processing through getPrpValueFN, the value isn't in this list, the default value is used
*/
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
