const checkIds = oboRequire('routes/api/drafts/get_duplicate_obo_node_id')

describe('draft id checker', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('parses a single level draft with no duplications', () => {
		let testTree = {
			id: 'test-id',
			children: []
		}
		let ids = {}

		let duplicate = checkIds(testTree, ids)

		expect(duplicate).toBe(null)
	})

	test('parses a multi level draft with no duplications', () => {
		let testTree = {
			id: 'test-id',
			children: [
				{
					id: 'test-id-2',
					children: []
				},
				{
					id: 'test-id-3',
					children: [
						{
							id: 'test-id-4',
							children: []
						}
					]
				}
			]
		}
		let ids = {}

		let duplicate = checkIds(testTree, ids)

		expect(duplicate).toBe(null)
	})

	test('parses a multi level draft with duplication', () => {
		let testTree = {
			id: 'test-id',
			children: [
				{
					id: 'duplicate-id-test',
					children: []
				},
				{
					id: 'test-id-3',
					children: [
						{
							id: 'duplicate-id-test',
							children: []
						}
					]
				}
			]
		}
		let ids = {}

		let duplicate = checkIds(testTree, ids)

		expect(duplicate).toBe('duplicate-id-test')
	})
})
