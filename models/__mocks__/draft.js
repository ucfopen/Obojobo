let permissions = oboRequire('config').permissions

let mockYell = jest.fn()

class MockDraft {
	constructor(rawDraft){
		this.yell = mockYell
		this.root = this
		this.document = `{"json":"value"}`
	}
}

MockDraft.fetchById = jest.fn().mockImplementation((id) => {
	return Promise.resolve(new MockDraft())
})

MockDraft.__setMockYell = (newMock) => {
	mockYell = newMock
}

module.exports = MockDraft;
