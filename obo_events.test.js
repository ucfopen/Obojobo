
describe('obo events', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	it('returns a singleton event emitter', () => {
		const mockModuleReturn = {test:true}
		jest.mock('events');
		jest.mock('./obo_events', () => { return mockModuleReturn }, {virtual: true});
		let oboEvents = require('./obo_events')
		expect(oboEvents).toBe(mockModuleReturn)
	})

})
