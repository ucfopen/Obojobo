let permissions = oboRequire('config').permissions

let mockYell = jest.fn()

class MockDraft {
	constructor(rawDraft) {
		this.yell = mockYell
		this.root = this
		this.document = `{"json":"value"}`
		this.getChildNodeById = jest.fn().mockReturnValue('mockChild')
		this.node = rawDraft
	}
}

MockDraft.fetchById = jest.fn().mockResolvedValue(new MockDraft())
MockDraft.createWithContent = jest.fn().mockResolvedValue({ id: 'mockDraftId' })
MockDraft.updateContent = jest.fn().mockResolvedValue('mockUpdatedContentId')
MockDraft.findDuplicateIds = jest.fn().mockReturnValue(null)

MockDraft.__setMockYell = newMock => {
	mockYell = newMock
}

module.exports = MockDraft
