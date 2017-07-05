import StyleType from './style-type'

class StyleRange {
	constructor(start, end, type, data) {
		if (start == null) {
			start = 0
		}
		if (end == null) {
			end = 0
		}
		if (type == null) {
			type = ''
		}
		this.type = type
		if (data == null) {
			data = {}
		}
		this.data = data
		this.start = parseInt(start, 10)
		this.end = parseInt(end, 10)
	}

	clone() {
		//@TODO - assumes 'data' is not an object (otherwise we should clone it)
		return new StyleRange(this.start, this.end, this.type, this.data)
	}

	getExportedObject() {
		return {
			type: this.type,
			start: this.start,
			end: this.end,
			data: this.data
		}
	}

	toString() {
		return this.type + ':' + this.start + ',' + this.end + '(' + this.data + ')'
	}

	isInvalid() {
		// @length() is 0 and @start > -1 and @end > -1
		return this.length() === 0 && this.start !== 0 && this.end !== 0
	}

	// Instead of deleting a range it might be more useful
	// to invalidate it now and delete it later
	invalidate() {
		return (this.start = this.end = -1)
	}
	// @start = @end = 0

	compareToRange(from, to) {
		if (to == null) {
			to = from
		}

		if (from === 0 && this.start === 0 && to <= this.end) {
			return StyleRange.CONTAINS
		}
		if (to <= this.start) {
			return StyleRange.AFTER
		}
		if (from > this.end) {
			return StyleRange.BEFORE
		}
		if (from >= this.start && to <= this.end) {
			return StyleRange.CONTAINS
		}
		if (from <= this.start && to >= this.end) {
			return StyleRange.ENSCAPSULATED_BY
		}
		if (from >= this.start) {
			return StyleRange.INSIDE_LEFT
		}
		return StyleRange.INSIDE_RIGHT
	}

	length() {
		return this.end - this.start
	}

	isMergeable(otherType, otherData) {
		if (this.type !== otherType) {
			return false
		}

		//return false if @type is StyleType.SUPERSCRIPT or @type is StyleType.SUBSCRIPT

		if (this.data instanceof Object) {
			for (let k in this.data) {
				let v = this.data[k]
				if (otherData[k] == null || otherData[k] !== v) {
					return false
				}
			}
		} else {
			if (this.data !== otherData) {
				return false
			}
		}

		return true
	}
}

StyleRange.BEFORE = 'before'
StyleRange.AFTER = 'after'
StyleRange.INSIDE_LEFT = 'left'
StyleRange.INSIDE_RIGHT = 'right'
StyleRange.CONTAINS = 'contains'
StyleRange.ENSCAPSULATED_BY = 'enscapsulatedBy'

StyleRange.createFromObject = o => new StyleRange(o.start, o.end, o.type, o.data)

export default StyleRange
