jest.mock('fs')
let fs = require('fs')
fs.__setMockFileContents(
	'./config/draft.json',
	'{"test":{"paths":["./__tests__/test_draft_path/"]}}'
)
fs.__setMockFileContents('./__tests__/test_draft_path/', '{}')
let oboPath = oboRequire('obo_path')

describe('obo path', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('expandDraftPath acts as expected', () => {
		expect(oboPath.expandDraftPath('app.js')).toBe(`${__dirname}/test_draft_path/app.js`)
		expect(oboPath.expandDraftPath('./app.js')).toBe(`${__dirname}/test_draft_path/app.js`)
		expect(oboPath.expandDraftPath('../test_draft_path/app.js')).toBe(
			`${__dirname}/test_draft_path/app.js`
		)
	})

	test('getDraftPath returns the path when there is a match', () => {
		expect(oboPath.getDraftPath()).toBe('./__tests__/test_draft_path/')
	})

	test('getDraftPath returns the path when there is no match', () => {
		fs.existsSync = jest.fn().mockReturnValue(false)

		expect(oboPath.getDraftPath()).toBe(null)

		fs.existsSync.mockReset()
	})
})
