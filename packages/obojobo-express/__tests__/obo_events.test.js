
describe('obo events', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	it('returns a singleton event emitter', () => {
		jest.mock('events');
		let expectedEmitter = require('events');
		let oboEvents = oboRequire('obo_events')
		expect(oboEvents).toBeInstanceOf(expectedEmitter)
	})

})
