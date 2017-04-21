let permissions = oboRequire('config').permissions

let mockYell = jest.fn()

class MockDraft {
	constructor(rawDraft){
		this.yell = mockYell
	}

	static fetchById(id){
		console.log('Mock fetch')
		return Promise.resolve(new MockDraft())
	}

}

MockDraft.fetchById = jest.fn().mockImplementation((id) => {
	return Promise.resolve(new MockDraft())
})

MockDraft.__setMockYell = (newMock) => {
	mockYell = newMock
}

module.exports = MockDraft;
