describe('obo events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('returns a singleton event emitter', () => {
		jest.mock('events')
		let expectedEmitter = require('events')
		let oboEvents = oboRequire('obo_events')
		expect(oboEvents).toBeInstanceOf(expectedEmitter)
	})
})
