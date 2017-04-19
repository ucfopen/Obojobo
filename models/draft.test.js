jest.mock('../db')

let mockRawDraft = {
	id:'whatever',
	version: 9,
	draft_created_at: new Date().toISOString(),
	content_created_at: new Date().toISOString(),
	content: {
		id: 666,
		type: 'DraftNode',
		children: [
			{
				id: 999,
				type: 'DraftNode',
			}
		]
	}
}

describe('models draft', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	it('initializes expected properties', () => {
		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let d = new Draft({});
		expect(d.nodesById).toBeInstanceOf(Map)
		expect(d.nodesByType).toBeInstanceOf(Map)
		expect(d.root).toBeInstanceOf(DraftNode)
	})

	it('loads a draft from the database', () => {
		expect.assertions(5)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(mockRawDraft)
		})

		return Draft.fetchById('whatever')
		.then(model => {
			expect(model).toBeInstanceOf(Draft)
			expect(model.root).toBeInstanceOf(DraftNode)
			expect(model.nodesById.size).toBe(2)
			expect(model.nodesById.get(666)).toBeInstanceOf(DraftNode)
			expect(model.nodesByType.get('DraftNode')).toHaveLength(2)
		})
	})

	it('returns error when not found in database', () => {
		expect.assertions(2)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.reject(new Error('not found in db'))
		})

		return Draft.fetchById('whatever')
		.then(model => {
			expect(true).toBe('this should never be called')
		})
		.catch(err => {
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('not found in db')
		})
	})

	it('responds to get document', () => {
		expect.assertions(1)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(mockRawDraft)
		})

		return Draft.fetchById('whatever')
		.then(model => {
			expect(model.document).toEqual(expect.objectContaining({
				children: expect.any(Array),
				id: 666,
				type: "DraftNode"
			}))
		})
	})

	it('responds to getChildNodeById', () => {
		expect.assertions(1)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(mockRawDraft)
		})

		return Draft.fetchById('whatever')
		.then(model => {
			expect(model.getChildNodeById(666)).toBeInstanceOf(DraftNode)
		})
	})

	it('responds to getChildNodesByType', () => {
		expect.assertions(2)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(mockRawDraft)
		})

		return Draft.fetchById('whatever')
		.then(model => {
			expect(model.getChildNodesByType('DraftNode')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('DraftNode')[0]).toBeInstanceOf(DraftNode)
		})
	})

	it('yells to child nodes', () => {
		expect.assertions(1)

		let Draft = oboRequire('models/draft')
		let DraftNode = oboRequire('models/draft_node')
		let db = oboRequire('db')
		let childNode
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(mockRawDraft)
		})

		return Draft.fetchById('whatever')
		.then(model => {
			childNode = model.getChildNodesByType('DraftNode')[0]
			childNode.yell = jest.fn().mockImplementationOnce((event) => {
				return [Promise.resolve()]
			})
			return model.yell()
		})
		.then(model => {
			expect(childNode.yell).toHaveBeenCalledTimes(1)
		})
	})

})
