let permissions = oboRequire('config').permissions

let mockYell = jest.fn()

class MockDraft {
	constructor(rawDraft) {
		this.yell = mockYell
		this.root = this
		this.document = `{"json":"value"}`
		this.draftId = rawDraft && rawDraft.draftId ? rawDraft.draftId : 1
		this.contentId = rawDraft && rawDraft.contentId ? rawDraft.contentId : 1
		this.getChildNodeById = jest.fn().mockReturnValue('mockChild')
		this.node = rawDraft
	}
}

MockDraft.fetchById = jest.fn().mockResolvedValue(new MockDraft())

MockDraft.__setMockYell = newMock => {
	mockYell = newMock
}

module.exports = MockDraft
