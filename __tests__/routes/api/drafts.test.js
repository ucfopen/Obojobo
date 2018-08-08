jest.mock('../../../models/draft')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
jest.mock('obojobo-draft-xml-parser/xml-to-draft-object')

import DraftModel from '../../../models/draft'
import User from '../../../models/user'
import logger from '../../../logger'
import mockXMLParser from 'obojobo-draft-xml-parser/xml-to-draft-object'
let xml = require('obojobo-draft-xml-parser/xml-to-draft-object')

const { mockExpressMethods, mockRouterMethods } = require('../../../__mocks__/__mock_express')

let mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')
const db = oboRequire('db')
const drafts = oboRequire('routes/api/drafts')

describe('api draft route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		logger.error.mockReset()
		mockInsertNewDraft.mockReset()
		mockXMLParser.mockReset()
	})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		oboRequire('routes/api/drafts')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.delete).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/new', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/new', expect.any(Function))
	})

	test('GET /:draftId handles missing drafts', () => {
		expect.assertions(1)

		DraftModel.fetchById.mockRejectedValueOnce('some error')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() }
		}

		let mockRes = {
			missing: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(err => {
				expect(mockRes.missing).toBeCalledWith('Draft not found')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('GET /:draftId calls internal:sendToClient', () => {
		expect.assertions(1)

		DraftModel.fetchById.mockResolvedValueOnce({
			root: {
				yell: jest.fn()
			}
		})

		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() }
		}

		let mockRes = {
			missing: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(err => {
				expect(mockRes.missing).toBeCalledWith('Draft not found')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('GET /new calls success', () => {
		expect.assertions(1)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockReturnValueOnce('fake draft')
			}
		})

		DraftModel.__setMockYell(mockYell)

		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canCreateDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		DraftModel.createWithContent.mockReturnValueOnce('test_result')

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith('test_result')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('GET /new requires user', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canCreateDrafts = false
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()
		DraftModel.createWithContent.mockReturnValueOnce('test_result')

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId calls res.success', () => {
		expect.assertions(1)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockReturnValueOnce('fake draft')
			}
		})

		DraftModel.__setMockYell(mockYell)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: { a: 1 },
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn(),
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith({ id: 'mockUpdatedContentId' })
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId parses bad xml', () => {
		expect.assertions(2)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]
		mockXMLParser.mockImplementationOnce(() => {
			throw 'mockError'
		})

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: 'mockXML',
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn(),
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(logger.error).toBeCalledWith('Posting draft failed - format unexpected:', 'mockXML')
				expect(mockRes.badInput).toBeCalledWith('Posting draft failed - format unexpected')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId parses good xml', () => {
		expect.assertions(1)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]
		mockXMLParser.mockReturnValueOnce({})

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: `<ObojoboDraftDocument>
				<Module title="My Module">
					<Content>
						<Page>
					        <Text>
								<textGroup>
									<t>Hello World!</t>
								</textGroup>
							</Text>
						</Page>
					</Content>
				</Module>
			</ObojoboDraftDocument>`,
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn(),
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith({ id: 'mockUpdatedContentId' })
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId parses good xml but does not return object', () => {
		expect.assertions(2)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		mockXMLParser.mockReturnValueOnce('mockJSON')
		let routeFunction = mockRouterMethods.post.mock.calls[1][1]
		let testXML = `<ObojoboDraftDocument>
			<Module title="My Module">
				<Content>
					<Page>
				        <Text>
							<textGroup>
								<t>Hello World!</t>
							</textGroup>
						</Text>
					</Page>
				</Content>
			</Module>
		</ObojoboDraftDocument>`

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: testXML,
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn(),
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(logger.error).toBeCalledWith('Posting draft failed - format unexpected:', testXML)
				expect(mockRes.badInput).toBeCalledWith('Posting draft failed - format unexpected')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId requires perms', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: { a: 1 },
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = false
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId requires login', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => Promise.reject('error1')
		}

		let mockRes = {
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('POST /:draftId rejects duplicate ids', () => {
		expect.assertions(2)

		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		let routeFunction = mockRouterMethods.post.mock.calls[1][1]
		DraftModel.findDuplicateIds.mockReturnValueOnce('mockDuplicateId')

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() },
			body: { a: 1 },
			requireCurrentUser: () => {
				let u = new User()
				u.id = 111
				u.canEditDrafts = true
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			success: jest.fn(),
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(logger.error).toBeCalledWith('Posting draft failed - duplicate id "mockDuplicateId"')
				expect(mockRes.badInput).toBeCalledWith(
					'Posting draft failed - duplicate id "mockDuplicateId"'
				)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('DELETE /:draftId rejects guest', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.delete.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => Promise.reject('error1')
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('delete draft requires canDeleteDrafts', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.delete.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => {
				let u = {}
				u.canDeleteDrafts = false
				return Promise.resolve(u)
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('delete draft requires deletes', () => {
		expect.assertions(1)

		db.none.mockResolvedValueOnce(5)

		let routeFunction = mockRouterMethods.delete.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			requireCurrentUser: () => Promise.resolve({ canDeleteDrafts: true })
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith(5)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('list drafts rejects guest', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => Promise.reject('error1')
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('list drafts requires canViewDrafts', () => {
		expect.assertions(1)

		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => Promise.resolve({ canViewDrafts: false })
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficient permissions')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('list drafts renders results', () => {
		expect.assertions(1)

		db.any.mockResolvedValueOnce(5)
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			params: { draftId: 555 },
			requireCurrentUser: () => Promise.resolve({ id: 5, canViewDrafts: true })
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith(5)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})
})
