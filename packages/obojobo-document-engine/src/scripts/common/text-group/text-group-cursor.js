class TextGroupCursor {
	constructor(virtualCursor) {
		this.virtualCursor = virtualCursor
	}
}

Object.defineProperties(TextGroupCursor.prototype, {
	isTextStart: {
		get() {
			return this.offset === 0
		}
	},

	isTextEnd: {
		get() {
			return this.offset === this.text.length
		}
	},

	isFirstText: {
		get() {
			return this.groupIndex === 0
		}
	},

	isLastText: {
		get() {
			return this.groupIndex === this.textGroup.length - 1
		}
	},

	isGroupStart: {
		get() {
			return this.isTextStart && this.isFirstText
		}
	},

	isGroupEnd: {
		get() {
			return this.isTextEnd && this.isLastText
		}
	},

	textGroup: {
		get() {
			return this.virtualCursor.chunk.modelState.textGroup
		}
	},

	groupIndex: {
		get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.groupIndex
			} else {
				return -1
			}
		}
	},

	offset: {
		get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.offset
			} else {
				return 0
			}
		}
	},

	textGroupItem: {
		get() {
			return this.virtualCursor.chunk.modelState.textGroup.get(this.virtualCursor.data.groupIndex)
		}
	},

	text: {
		get() {
			return this.textGroupItem.text
		}
	}
})

export default TextGroupCursor
