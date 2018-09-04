describe('obo events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('returns a singleton event emitter', () => {
		jest.mock('events')
		const expectedEmitter = require('events')
		const oboEvents = oboRequire('obo_events')
		expect(oboEvents).toBeInstanceOf(expectedEmitter)
	})
})
