let draft_node_store
let DraftNode

describe('draft_node_store', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetModules() // needed to completely reset draft_node_store
		draft_node_store = oboRequire('draft_node_store')
		DraftNode = global.oboRequire('models/draft_node')
	})
	afterEach(() => {})

	test('get returns a Draft Node by default', () => {
		const g = draft_node_store.get('no-way-this-exists')
		expect(g).toBe(DraftNode)
	})

	test('add accepts a new node and returns it', () => {
		const testNodeOne = { nodeName: 'test-node-one' }
		const testNodeTwo = { nodeName: 'test-node-two' }

		draft_node_store.add(testNodeOne)
		draft_node_store.add(testNodeTwo)

		expect(draft_node_store.get('test-node-one')).toBe(testNodeOne)
		expect(draft_node_store.get('test-node-two')).toBe(testNodeTwo)
	})

	test('add throws error adding a class with no nodename', () => {
		expect(() => {
			draft_node_store.add({})
		}).toThrowErrorMatchingSnapshot()
	})

	test('add throws error when registering an oboNode with a name thats already registered', () => {
		const testNode = { nodeName: 'test-node-one' }
		const testNodeImposter = { nodeName: 'test-node-one' } // node name is a duplicate of testNode

		draft_node_store.add(testNode)

		expect(() => {
			// not allowed - we want an error here
			// to help prevent issues
			draft_node_store.add(testNodeImposter)
		}).toThrowErrorMatchingSnapshot()

		expect(draft_node_store.get('test-node-one')).toBe(testNode)
	})
})
