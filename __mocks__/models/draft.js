let mockYell = jest.fn()

class MockDraft {
	constructor(rawDraft) {
		this.yell = mockYell
		this.root = this
		this.document = `{"json":"value"}`
		this.getChildNodeById = jest.fn().mockReturnValue('mockChild')
		this.node = rawDraft
		this.childrent = []
	}
}

MockDraft.fetchById = jest.fn().mockResolvedValue(new MockDraft())

MockDraft.__setMockYell = newMock => {
	mockYell = newMock
}

module.exports = MockDraft
