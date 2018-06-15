jest.mock('test_node')

let DraftNode = global.oboRequire('models/draft_node')
let TestNode = require('test_node')

let draft_node_store = oboRequire('draft_node_store')

describe('draft_node_store', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('get returns a Draft Node by default', () => {
		let g = draft_node_store.get('no-way-this-exists')
		expect(g).toBe(DraftNode)
	})

	it('add accepts a new node and returns it', () => {
		draft_node_store.add('test-node', 'test_node')
		let g = draft_node_store.get('test-node')
		expect(g).toBe(TestNode)
	})

	it('add throws error setting a non-existant file', () => {
		expect(() => {
			draft_node_store.add('fail-node', 'non_existant_require_file')
		}).toThrow()
	})

	it('add ignores subsequent calls', () => {
		draft_node_store.add('test-node-ignore', './models/draft_node')
		let g = draft_node_store.get('test-node-ignore')
		expect(g).toBe(DraftNode)

		draft_node_store.add('test-node-ignore', 'test_node')
		let g2 = draft_node_store.get('test-node-ignore')
		expect(g2).toBe(DraftNode)
	})
})
