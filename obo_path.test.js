jest.mock('fs')
let fs = require('fs')
fs.__setMockFileContents('./config/draft.json', '{"test":{"paths":["./test_draft_path/"]}}');
fs.__setMockFileContents('./test_draft_path/', '{}');
let oboPath = require('./obo_path')

describe('obo path', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('expandDraftPath acts as expected', () => {
		expect(oboPath.expandDraftPath('app.js')).toBe(`${__dirname}/test_draft_path/app.js`)
		expect(oboPath.expandDraftPath('./app.js')).toBe(`${__dirname}/test_draft_path/app.js`)
		expect(oboPath.expandDraftPath('../test_draft_path/app.js')).toBe(`${__dirname}/test_draft_path/app.js`)
	})

	it('getDraftPath returns the path when there is a match', () => {
		expect(oboPath.getDraftPath('./test_draft_path/')).toBe('./test_draft_path/')
	})

})
