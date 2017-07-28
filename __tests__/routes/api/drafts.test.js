jest.mock('../../../models/draft')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')

let mockExpressMethods = {}
let mockRouterMethods = {}
let mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')
let mockUpdateDraft = mockVirtual('./routes/api/drafts/update_draft')

let mockExpress = () => {
	jest.mock(
		'express',
		() => {
			let module = () => {
				let methods = ['on', 'use', 'get', 'post', 'put', 'delete', 'all', 'static']
				let obj = {}
				methods.forEach(m => {
					obj[m] = mockExpressMethods[m] = jest.fn()
				})
				return obj
			}

			module.Router = () => {
				let methods = ['all', 'get', 'post', 'delete', 'put']
				let obj = {}
				methods.forEach(m => {
					obj[m] = mockRouterMethods[m] = jest.fn()
				})
				return obj
			}

			return module
		},
		{ virtual: true }
	)
}

describe('api draft route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		mockExpress()
		require('express')
		oboRequire('routes/api/drafts')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.delete).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/new', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/new', expect.any(Function))
		// expect(mockRouterMethods.all).toBeCalledWith('/:draftId*', expect.any(Function))
	})

	test('get draft calls next', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		let DraftModel = oboRequire('models/draft')
		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() }
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.success).toBeCalledWith(`{"json":"value"}`)
			expect(mockNext).toBeCalledWith()
		})
	})

	test('get draft handles missing drafts', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		let DraftModel = oboRequire('models/draft')
		DraftModel.fetchById.mockImplementationOnce(() => {
			return Promise.reject('some error')
		})

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			app: { get: jest.fn() }
		}

		let mockRes = {
			missing: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext).catch(err => {
			expect(mockRes.missing).toBeCalledWith('Draft not found')
			expect(mockNext).toBeCalledWith('some error')
		})
	})

	test('create draft calls next', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		let User = oboRequire('models/user')
		let DraftModel = oboRequire('models/draft')
		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		oboRequire('routes/api/drafts')
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
		mockInsertNewDraft.mockImplementationOnce(() => {
			return 'test_result'
		})

		return routeFunction(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.success).toBeCalledWith('test_result')
			expect(mockNext).toBeCalledWith()
		})
	})

	test('creates draft requires user', () => {
		expect.assertions(2)

		mockExpress()
		require('express')
		let User = oboRequire('models/user')
		oboRequire('routes/api/drafts')
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
		mockInsertNewDraft.mockImplementationOnce(() => {
			return 'test_result'
		})

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
				expect(mockNext).toBeCalledWith('Insufficent permissions')
			})
	})

	test('save draft calls next', () => {
		expect.assertions(2)
		mockUpdateDraft.mockImplementationOnce(() => {
			return Promise.resolve(555)
		})
		mockExpress()
		require('express')
		let User = oboRequire('models/user')
		let DraftModel = oboRequire('models/draft')
		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		oboRequire('routes/api/drafts')
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
				expect(mockRes.success).toBeCalledWith({ id: 555 })
				expect(mockNext).toBeCalledWith()
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('save draft requires perms', () => {
		expect.assertions(2)
		mockExpress()
		require('express')
		let User = oboRequire('models/user')
		oboRequire('routes/api/drafts')
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
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
				expect(mockNext).toBeCalledWith('Insufficent permissions')
			})
	})

	test('save draft requires login', () => {
		expect.assertions(2)
		mockExpress()
		require('express')

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.post.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.reject('error1')
			}
		}

		let mockRes = {
			unexpected: jest.fn(),
			badInput: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
				expect(mockNext).toBeCalledWith('error1')
			})
	})

	test('delete draft rejects guest', () => {
		expect.assertions(2)
		mockExpress()
		require('express')

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.delete.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.reject('error1')
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
				expect(mockNext).toBeCalledWith('error1')
			})
	})

	test('delete draft requires canDeleteDrafts', () => {
		expect.assertions(2)
		mockExpress()
		require('express')

		oboRequire('routes/api/drafts')
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
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
				expect(mockNext).toBeCalledWith('Insufficent permissions')
			})
	})

	test('delete draft requires deletes', () => {
		expect.assertions(2)
		mockExpress()
		require('express')
		let db = oboRequire('db')
		db.none.mockImplementationOnce(() => {
			return Promise.resolve(5)
		})

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.delete.mock.calls[0][1]

		let mockReq = {
			params: { draftId: 555 },
			requireCurrentUser: () => {
				return Promise.resolve({ canDeleteDrafts: true })
			}
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith(5)
				expect(mockNext).toBeCalledWith()
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('list drafts rejects guest', () => {
		expect.assertions(2)
		mockExpress()
		require('express')

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.reject('error1')
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('error1')
				expect(mockNext).toBeCalledWith('error1')
			})
	})

	test('list drafts requires canViewDrafts', () => {
		expect.assertions(2)
		mockExpress()
		require('express')

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.resolve({ canViewDrafts: false })
			}
		}

		let mockRes = {
			unexpected: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(true).toBe('never called')
			})
			.catch(err => {
				expect(mockRes.unexpected).toBeCalledWith('Insufficent permissions')
				expect(mockNext).toBeCalledWith('Insufficent permissions')
			})
	})

	test('list drafts renders results', () => {
		expect.assertions(2)
		mockExpress()
		require('express')
		let db = oboRequire('db')
		db.any.mockImplementationOnce(() => {
			return Promise.resolve(5)
		})

		oboRequire('routes/api/drafts')
		let routeFunction = mockRouterMethods.get.mock.calls[1][1]

		let mockReq = {
			params: { draftId: 555 },
			requireCurrentUser: () => {
				return Promise.resolve({ id: 5, canViewDrafts: true })
			}
		}

		let mockRes = {
			success: jest.fn()
		}

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(() => {
				expect(mockRes.success).toBeCalledWith(5)
				expect(mockNext).toBeCalledWith()
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})
})
