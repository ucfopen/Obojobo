import setProp from '../src/scripts/common/util/set-prop'

class OboModel {
	static create(attrs) {
		return new OboModel(attrs)
	}

	constructor(attrs) {
		this._isMocked = true
		this.modelState = {}
		this.content = attrs.content || {}
	}

	setStateProp(propName, defaultValue, transformValueFn, allowedValues) {
		setProp(this.modelState, this.content, propName, defaultValue, transformValueFn, allowedValues)
	}
}

export default OboModel
