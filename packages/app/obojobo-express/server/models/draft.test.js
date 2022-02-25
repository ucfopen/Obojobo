describe('Draft Model', () => {
	jest.mock('../db')
	jest.mock('../logger')
	jest.mock('../obo_events')
	let db
	let DraftModel
	let DraftNode
	let mockRawDraft

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('../db')
		DraftNode = require('./draft_node')
		DraftModel = require('./draft')
		mockRawDraft = {
			id: 'whatever',
			version: 9,
			draft_created_at: new Date().toISOString(),
			content_created_at: new Date().toISOString(),
			content: {
				id: 666,
				stuff: true,
				type: 'DraftNode',
				content: { nothing: true },
				children: [
					{
						id: 999,
						type: 'DraftNode',
						content: { otherStuff: true }
					},
					{
						id: 222,
						type: 'Some.Node.Type',
						content: { yes: 'no' }
					}
				]
			}
		}
	})
	afterEach(() => {})

	test('constructor initializes expected properties', () => {
		const d = new DraftModel('mock-author-id', {})
		expect(d.nodesById).toBeInstanceOf(Map)
		expect(d.nodesByType).toBeInstanceOf(Map)
		expect(d.root).toBeInstanceOf(DraftNode)
		expect(d.authorId).toBe('mock-author-id')
	})

	test('yell calls to child nodes', () => {
		expect.hasAssertions()

		let childNode
		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever')
			.then(model => {
				childNode = model.getChildNodesByType('DraftNode')[0]
				childNode.yell = jest.fn().mockImplementationOnce(() => {
					return [Promise.resolve()]
				})
				return model.yell()
			})
			.then(() => {
				expect(childNode.yell).toHaveBeenCalledTimes(1)
			})
	})

	test('fetchById retrives a DraftDocument from the database', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model).toBeInstanceOf(DraftModel)
			expect(model.root).toBeInstanceOf(DraftNode)
			expect(model.nodesById.size).toBe(3)
			expect(model.getChildNodeById(999)).toBeInstanceOf(DraftNode)
			expect(model.nodesByType.get('DraftNode')).toHaveLength(2)
		})
	})

	test('fetchById returns error when not found in database', async () => {
		expect.hasAssertions()

		db.one.mockRejectedValueOnce(new Error('not found in db'))

		await expect(DraftModel.fetchById('whatever')).rejects.toThrow('not found in db')
	})

	test('createWithContent inserts a new draft', () => {
		expect.hasAssertions()
		// mock insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// respond to insert content
		db.one.mockResolvedValueOnce('inserted content result')
		const mockContent = { content: 'yes' }
		const mockXMLContent = '<?xml version="1.0" encoding="utf-8"?><ObojoboDraftDoc />'
		const mockUserId = 555
		return DraftModel.createWithContent(mockUserId, mockContent, mockXMLContent).then(newDraft => {
			// make sure we're using a transaction
			expect(db.tx).toBeCalled()

			// make sure the result looks as expected
			expect(newDraft).toEqual({
				content: 'inserted content result',
				id: 'NEWID'
			})

			// make sure mockUserID is sent to the insert draft query
			expect(db.one.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					userId: mockUserId
				})
			)

			// make sure the id coming back from insert draft is used to insert content
			// and make sure the content is sent to the query
			expect(db.one.mock.calls[1][1]).toEqual({
				jsonContent: mockContent,
				userId: 555,
				xmlContent: mockXMLContent,
				draftId: 'NEWID'
			})
		})
	})

	test('createWithContent fails when begin tranaction fails', () => {
		expect.hasAssertions()

		// reject transaction
		db.tx.mockRejectedValueOnce(new Error('error'))

		return expect(DraftModel.createWithContent(0)).rejects.toThrow('error')
	})

	test('createWithContent fails when insert draft fails', () => {
		expect.hasAssertions()

		// reject insert draft query
		db.one.mockRejectedValueOnce(new Error('an error'))

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('an error')
	})

	test('createWithContent fails when insert content fails', () => {
		expect.hasAssertions()

		// respond to insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// reject insert content query
		db.one.mockRejectedValueOnce(new Error('arrrg!'))

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('arrrg!')
	})

	test('updateContent calls db.one with expected args', async () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce({ id: 555 })

		const resultId = await DraftModel.updateContent(
			555,
			'mockUserId',
			'mockJsonContent',
			'mockXmlContent'
		)

		expect(resultId).toBe(555)
		expect(db.one).toBeCalledWith(
			expect.any(String),
			expect.objectContaining({
				draftId: 555,
				userId: 'mockUserId',
				jsonContent: 'mockJsonContent',
				xmlContent: 'mockXmlContent'
			})
		)
	})

	test('updateContent fails as expected', () => {
		expect.hasAssertions()
		db.one.mockRejectedValueOnce('test error')

		return DraftModel.updateContent(555, 'content').catch(err => {
			expect(err).toBe('test error')
		})
	})

	test('findDuplicateIds parses a single level draft with no duplications', () => {
		const testTree = {
			id: 'test-id',
			children: []
		}

		const duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds hanldes null children', () => {
		const testTree = {
			id: 'test-id',
			children: null
		}

		const duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a single level draft with no ids', () => {
		const testTree = {
			children: []
		}

		const duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a multi level draft with no duplications', () => {
		const testTree = {
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

		const duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a multi level draft with duplication', () => {
		const testTree = {
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

		const duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe('duplicate-id-test')
	})

	test('get document returns the root object', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)
		return DraftModel.fetchById('whatever').then(model => {
			expect(model.document).toEqual(
				expect.objectContaining({
					children: expect.any(Array),
					id: 666,
					type: 'DraftNode',
					stuff: true
				})
			)
		})
	})

	test('getChildNodeById returns the child with a matching id', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model.getChildNodeById(666)).toBeInstanceOf(DraftNode)
			expect(model.getChildNodeById(666).node.id).toBe(666)
			expect(model.getChildNodeById(666).node.stuff).toBe(true)
			expect(model.getChildNodeById(666).node.type).toBe('DraftNode')
		})
	})

	test('deleteByIdAndUser sets delete flag', () => {
		expect.hasAssertions()
		const oboEvents = require('../obo_events')

		db.none.mockResolvedValueOnce()

		return DraftModel.deleteByIdAndUser('draft_id', 'user_id').then(voidResult => {
			expect(voidResult).toBe(undefined) //eslint-disable-line no-undefined
			expect(oboEvents.emit).toHaveBeenCalledWith('EVENT_DRAFT_DELETED', {
				id: 'draft_id',
				userId: 'user_id'
			})
		})
	})

	test('deleteByIdAndUser fails as expected', () => {
		expect.hasAssertions()

		db.none.mockRejectedValueOnce('mock-error')

		return expect(DraftModel.deleteByIdAndUser('draft_id', 'user_id')).rejects.toBe('mock-error')
	})

	test('restoreByIdAndUser reverts delete flag', () => {
		expect.hasAssertions()
		const oboEvents = require('../obo_events')

		db.none.mockResolvedValueOnce()

		return DraftModel.restoreByIdAndUser('draft_id', 'user_id').then(voidResult => {
			expect(voidResult).toBe(undefined) //eslint-disable-line no-undefined
			expect(oboEvents.emit).toHaveBeenCalledWith('EVENT_DRAFT_RESTORED', {
				id: 'draft_id',
				userId: 'user_id'
			})
		})
	})

	test('restoreByIdAndUser fails as expected', () => {
		expect.hasAssertions()

		db.none.mockRejectedValueOnce('mock-error')

		return expect(DraftModel.restoreByIdAndUser('draft_id', 'user_id')).rejects.toBe('mock-error')
	})

	test('getChildNodesByType returns all nodes with a matching type', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model.getChildNodesByType('DraftNode')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('DraftNode')).toHaveLength(2)
			expect(model.getChildNodesByType('DraftNode')[0]).toBeInstanceOf(DraftNode)

			expect(model.getChildNodesByType('Some.Node.Type')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('Some.Node.Type')).toHaveLength(1)
			expect(model.getChildNodesByType('Some.Node.Type')[0]).toBeInstanceOf(DraftNode)

			//eslint-disable-next-line no-undefined
			expect(model.getChildNodesByType('Some.Missing.Node')).toBe(undefined)
		})
	})

	test('fetchDraftByVersion returns a draft', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchDraftByVersion('whatever').then(model => {
			expect(model.getChildNodesByType('DraftNode')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('DraftNode')).toHaveLength(2)
			expect(model.getChildNodesByType('DraftNode')[0]).toBeInstanceOf(DraftNode)

			expect(model.getChildNodesByType('Some.Node.Type')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('Some.Node.Type')).toHaveLength(1)
			expect(model.getChildNodesByType('Some.Node.Type')[0]).toBeInstanceOf(DraftNode)

			//eslint-disable-next-line no-undefined
			expect(model.getChildNodesByType('Some.Missing.Node')).toBe(undefined)
		})
	})

	test('fetchDraftByVersion handles errors', () => {
		expect.hasAssertions()

		db.one.mockRejectedValueOnce('mock-error')

		return expect(DraftModel.fetchDraftByVersion(0)).rejects.toMatch('mock-error')
	})

	test('xmlDocument queries the database and returns xml content', () => {
		expect.hasAssertions()

		const mockQueryResult = { xml: 'mock-xml-content' }
		db.one.mockResolvedValueOnce(mockRawDraft)
		db.oneOrNone.mockResolvedValueOnce(mockQueryResult)

		return DraftModel.fetchById('whatever')
			.then(model => model.xmlDocument)
			.then(xml => {
				expect(xml).toBe('mock-xml-content')
			})
	})

	test('xmlDocument queries the database and returns void with no results', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)
		db.oneOrNone.mockResolvedValueOnce(null)

		return DraftModel.fetchById('whatever')
			.then(model => model.xmlDocument)
			.then(xml => {
				expect(xml).toBe(null)
			})
	})

	test('xmlDocument errors with query error', async () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawDraft)
		db.oneOrNone.mockRejectedValueOnce('mock-error')

		const draft = await DraftModel.fetchById('whatever')
		return expect(draft.xmlDocument).rejects.toBe('mock-error')
	})

	test('getTitle gets content and returns empty string when title is missing', async () => {
		expect.hasAssertions()

		// no title in mockRawDraft yet
		db.one.mockResolvedValueOnce(mockRawDraft)
		let draft = await DraftModel.fetchById('whatever')
		expect(draft.getTitle()).toBe('')

		// add a title
		mockRawDraft.content.content.title = 'mock title'
		db.one.mockResolvedValueOnce(mockRawDraft)
		draft = await DraftModel.fetchById('whatever')
		expect(draft.getTitle()).toBe('mock title')

		// delete the content just to make sure nested test works
		delete mockRawDraft.content.content
		db.one.mockResolvedValueOnce(mockRawDraft)
		draft = await DraftModel.fetchById('whatever')
		expect(draft.getTitle()).toBe('')
	})
})
