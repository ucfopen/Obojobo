describe('obo events default', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('loads ok', () => {
		jest.mock('events')
		let expectedEmitter = require('events')
		let oboEvents = oboRequire('obo_events_default')
		expect(true).toBe(true)
	})
})
