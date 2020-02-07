let mockYell = jest.fn()

const mockGetChildNodeById = jest.fn().mockReturnValue('mockChild')

class MockDraft {
	constructor(rawDraft) {
		this.yell = mockYell
		this.root = this
		this.document = `{"json":"value"}`
		this.draftId = rawDraft && rawDraft.draftId ? rawDraft.draftId : 1
		this.contentId = rawDraft && rawDraft.contentId ? rawDraft.contentId : 1
		this.getChildNodeById = mockGetChildNodeById
		this.node = rawDraft
	}
}

MockDraft.fetchById = jest.fn().mockImplementation(() => Promise.resolve(new MockDraft()))
MockDraft.createWithContent = jest.fn().mockResolvedValue({ id: 'mockDraftId' })
MockDraft.updateContent = jest.fn().mockResolvedValue('mockUpdatedContentId')
MockDraft.findDuplicateIds = jest.fn().mockReturnValue(null)
MockDraft.fetchDraftByVersion = jest.fn().mockImplementation(() => Promise.resolve(new MockDraft()))
MockDraft.deleteByIdAndUser = jest.fn().mockResolvedValue(null)

MockDraft.mockGetChildNodeById = mockGetChildNodeById
MockDraft.__setMockYell = newMock => {
	mockYell = newMock
}

module.exports = MockDraft
