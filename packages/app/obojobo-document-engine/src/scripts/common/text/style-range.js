class StyleRange {
	static createFromObject(o) {
		return new StyleRange(o.start, o.end, o.type, o.data)
	}

	constructor(start = 0, end = 0, type = '', data = {}) {
		this.type = type
		this.data = data
		this.start = parseInt(start, 10)
		this.end = parseInt(end, 10)
	}

	clone() {
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
		return this.length() === 0 && this.start !== 0 && this.end !== 0
	}

	// Instead of deleting a range it might be more useful
	// to invalidate it now and delete it later
	invalidate() {
		this.start = this.end = -1
	}

	compareToRange(from, to = null) {
		if (to === null) to = from

		if (from === 0 && this.start === 0 && to <= this.end) return StyleRange.CONTAINS
		if (to <= this.start) return StyleRange.AFTER
		if (from > this.end) return StyleRange.BEFORE
		if (from >= this.start && to <= this.end) return StyleRange.CONTAINS
		if (from <= this.start && to >= this.end) return StyleRange.ENSCAPSULATED_BY
		if (from >= this.start) return StyleRange.INSIDE_LEFT
		return StyleRange.INSIDE_RIGHT
	}

	length() {
		return this.end - this.start
	}

	isMergeable(otherType, otherData) {
		if (this.type !== otherType) return false

		if (this.data instanceof Object) {
			for (const k in this.data) {
				const v = this.data[k]
				if (otherData[k] === null || typeof otherData[k] === 'undefined' || otherData[k] !== v) {
					return false
				}
			}
		} else if (this.data !== otherData) {
			return false
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

export default StyleRange
