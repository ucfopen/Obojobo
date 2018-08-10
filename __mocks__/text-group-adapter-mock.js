class TextGroup {
	static fromDescriptor(mockValue) {
		return new TextGroup(mockValue)
	}

	constructor(mockValue) {
		this.mockTextGroupValue = mockValue
	}

	toDescriptor() {
		return {
			textGroupMockJSON: this.mockTextGroupValue
		}
	}

	clone() {
		return new TextGroup(this.mockTextGroupValue + ':cloned')
	}
}

export default TextGroup
