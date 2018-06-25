jest.mock('../../db')
jest.mock('../../logger')

import DraftModel from '../../models/draft'
import DraftNode from '../../models/draft_node'

const db = oboRequire('db')

describe('Draft Model', () => {
	let mockRawDraft = {
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

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
	})
	afterEach(() => {})

	test('constructor initializes expected properties', () => {
		let d = new DraftModel({})
		expect(d.nodesById).toBeInstanceOf(Map)
		expect(d.nodesByType).toBeInstanceOf(Map)
		expect(d.root).toBeInstanceOf(DraftNode)
	})

	test('yell calls to child nodes', () => {
		expect.assertions(1)

		let childNode
		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever')
			.then(model => {
				childNode = model.getChildNodesByType('DraftNode')[0]
				childNode.yell = jest.fn().mockImplementationOnce(event => {
					return [Promise.resolve()]
				})
				return model.yell()
			})
			.then(model => {
				expect(childNode.yell).toHaveBeenCalledTimes(1)
			})
	})

	test('fetchById retrives a DraftDocument from the database', () => {
		expect.assertions(5)

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model).toBeInstanceOf(DraftModel)
			expect(model.root).toBeInstanceOf(DraftNode)
			expect(model.nodesById.size).toBe(3)
			expect(model.getChildNodeById(999)).toBeInstanceOf(DraftNode)
			expect(model.nodesByType.get('DraftNode')).toHaveLength(2)
		})
	})

	test('fetchById returns error when not found in database', () => {
		expect.assertions(2)

		db.one.mockRejectedValueOnce(new Error('not found in db'))

		return DraftModel.fetchById('whatever')
			.then(model => {
				expect(true).toBe('this should never be called')
			})
			.catch(err => {
				expect(err).toBeInstanceOf(Error)
				expect(err.message).toBe('not found in db')
			})
	})

	test('createWithContent inserts a new draft', () => {
		expect.assertions(4)
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
				xmlContent: mockXMLContent,
				draftId: 'NEWID'
			})
		})
	})

	test('createWithContent fails when begin tranaction fails', () => {
		expect.assertions(1)

		// reject transaction
		db.tx.mockRejectedValueOnce(new Error('error'))

		return expect(DraftModel.createWithContent(0)).rejects.toThrow('error')
	})

	test('createWithContent fails when insert draft fails', () => {
		expect.assertions(1)

		// reject insert draft query
		db.one.mockRejectedValueOnce(new Error('an error'))

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('an error')
	})

	test('createWithContent fails when insert content fails', () => {
		expect.assertions(1)

		// respond to insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// reject insert content query
		db.one.mockRejectedValueOnce(new Error('arrrg!'))

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('arrrg!')
	})

	test('updateContent calls db.one with expected args', () => {
		expect.assertions(2)

		const id = 555
		const jsonContent = 'mockJsonContent'
		const xmlContent = 'mockXmlContent'

		db.one.mockResolvedValueOnce({ id })

		return DraftModel.updateContent(id, jsonContent, xmlContent)
			.then(resultId => {
				expect(resultId).toBe(id)
				expect(db.one).toBeCalledWith(
					expect.any(String),
					expect.objectContaining({
						draftId: id,
						jsonContent: jsonContent,
						xmlContent: xmlContent
					})
				)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('updateContent fails as expected', () => {
		expect.assertions(1)
		db.one.mockRejectedValueOnce('test error')

		return DraftModel.updateContent(555, 'content')
			.then(id => {
				expect(id).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('test error')
			})
	})

	test('findDuplicateIds parses a single level draft with no duplications', () => {
		let testTree = {
			id: 'test-id',
			children: []
		}

		let duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a single level draft with no ids', () => {
		let testTree = {
			children: []
		}

		let duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a multi level draft with no duplications', () => {
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

		let duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe(null)
	})

	test('findDuplicateIds parses a multi level draft with duplication', () => {
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

		let duplicate = DraftModel.findDuplicateIds(testTree)

		expect(duplicate).toBe('duplicate-id-test')
	})

	test('get document returns the root object', () => {
		expect.assertions(1)

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
		expect.assertions(4)

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model.getChildNodeById(666)).toBeInstanceOf(DraftNode)
			expect(model.getChildNodeById(666).node.id).toBe(666)
			expect(model.getChildNodeById(666).node.stuff).toBe(true)
			expect(model.getChildNodeById(666).node.type).toBe('DraftNode')
		})
	})

	test('getChildNodesByType returns all nodes with a matching type', () => {
		expect.assertions(7)

		db.one.mockResolvedValueOnce(mockRawDraft)

		return DraftModel.fetchById('whatever').then(model => {
			expect(model.getChildNodesByType('DraftNode')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('DraftNode')).toHaveLength(2)
			expect(model.getChildNodesByType('DraftNode')[0]).toBeInstanceOf(DraftNode)

			expect(model.getChildNodesByType('Some.Node.Type')).toBeInstanceOf(Array)
			expect(model.getChildNodesByType('Some.Node.Type')).toHaveLength(1)
			expect(model.getChildNodesByType('Some.Node.Type')[0]).toBeInstanceOf(DraftNode)

			expect(model.getChildNodesByType('Some.Missing.Node')).toBe(undefined)
		})
	})
})
