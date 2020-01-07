describe('Edit Lock Model', () => {
	jest.mock('../../db')
	jest.mock('../../config') // to allow us to alter general.editLockExpireMinutes
	const MOCK_EXPIRE_MINUTES = 'mock-expire-minutes'
	let db
	let EditLock
	let config

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('../../db')
		config = require('../../config')
		config.general.editLockExpireMinutes = MOCK_EXPIRE_MINUTES
		EditLock = require('../../models/edit_lock')
	})
	afterEach(() => {})

	test('constructor transfers arguments into instance', () => {
		const lock = new EditLock({ id: 5, userId: 1, draftId: 5, createdAt: 'now' })
		expect(lock).toMatchInlineSnapshot(`
		EditLock {
		  "createdAt": "now",
		  "draftId": 5,
		  "id": 5,
		  "userId": 1,
		}
	`)
	})

	test('deleteExpiredLocks returns result from query directly', () => {
		db.result.mockResolvedValueOnce('mock-result')
		return EditLock.deleteExpiredLocks().then(result => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(result).toBe('mock-result')
		})
	})

	test('deleteExpiredLocks uses editLockExpireMinutes from config', () => {
		db.result.mockResolvedValueOnce('mock-result')
		return EditLock.deleteExpiredLocks().then(() => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(db.result).toHaveBeenCalledWith(
				expect.stringContaining(`${MOCK_EXPIRE_MINUTES} minutes`),
				null,
				expect.any(Function)
			)
		})
	})

	test('deleteExpiredLocks omits items newer then expire minutes', () => {
		db.result.mockResolvedValueOnce('mock-result')
		return EditLock.deleteExpiredLocks().then(() => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(db.result).toHaveBeenCalledWith(
				expect.stringContaining('created_at < now() - interval'),
				null,
				expect.any(Function)
			)
		})
	})

	test('deleteExpiredLocks requests rowCount from results', () => {
		db.result.mockResolvedValueOnce('mock-result')
		return EditLock.deleteExpiredLocks().then(() => {
			expect(db.result).toHaveBeenCalledTimes(1)
			const queryReturnFn = db.result.mock.calls[0][2]
			expect(queryReturnFn({ rowCount: 'mock-row-count' })).toBe('mock-row-count')
		})
	})

	test('deleteByDraftIdandUser calls the expected query with arguments', () => {
		db.result.mockResolvedValueOnce(1) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(() => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(db.result).toHaveBeenCalledWith(
				expect.stringContaining('DELETE'),
				{ userId: 'mock-user-id', draftId: 'mock-draft-id' },
				expect.any(Function)
			)
		})
	})

	test('deleteByDraftIdandUser requests rowCount from results', () => {
		db.result.mockResolvedValueOnce(1) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(() => {
			expect(db.result).toHaveBeenCalledTimes(1)
			const queryReturnFn = db.result.mock.calls[0][2]
			expect(queryReturnFn({ rowCount: 'mock-row-count' })).toBe('mock-row-count')
		})
	})

	test('deleteByDraftIdandUser returns false when no rows are affected', () => {
		db.result.mockResolvedValueOnce(0) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(success => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(success).toBe(false)
		})
	})

	test('deleteByDraftIdandUser returns true when 1 rows are affected', () => {
		db.result.mockResolvedValueOnce(1) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(success => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(success).toBe(true)
		})
	})

	test('deleteByDraftIdandUser returns true when 50 rows are affected', () => {
		db.result.mockResolvedValueOnce(50) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(success => {
			expect(db.result).toHaveBeenCalledTimes(1)
			expect(success).toBe(true)
		})
	})

	test('deleteByDraftIdandUser calls the expected query with arguments', () => {
		db.result.mockResolvedValueOnce(50) // mock affected row count
		return EditLock.deleteByDraftIdandUser('mock-user-id', 'mock-draft-id').then(() => {
			expect(db.result).toHaveBeenCalledWith(
				expect.stringContaining('DELETE'),
				expect.anything(),
				expect.any(Function)
			)
			expect(db.result).toHaveBeenCalledWith(
				expect.anything(),
				{ userId: 'mock-user-id', draftId: 'mock-draft-id' },
				expect.any(Function)
			)
		})
	})

	test('fetchByDraftId returns a lock based on query results', () => {
		db.oneOrNone.mockResolvedValueOnce({ mockLockId: 'mock-lock-id' })
		return EditLock.fetchByDraftId().then(lock => {
			expect(lock).toMatchInlineSnapshot(`
			EditLock {
			  "mockLockId": "mock-lock-id",
			}
		`)
		})
	})

	test('fetchByDraftId calls the expected query with arguments', () => {
		return EditLock.fetchByDraftId('mock-draft-id').then(() => {
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT'),
				expect.anything()
			)
			expect(db.oneOrNone).toHaveBeenCalledWith(expect.anything(), { draftId: 'mock-draft-id' })
		})
	})

	test('fetchByDraftId uses editLockExpireMinutes from config', () => {
		db.oneOrNone.mockResolvedValueOnce({ mockLockId: 'mock-lock-id' })
		return EditLock.fetchByDraftId().then(() => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining(`${MOCK_EXPIRE_MINUTES} minutes`),
				expect.anything()
			)
		})
	})

	test('fetchByDraftId omits items older then expire minutes', () => {
		db.oneOrNone.mockResolvedValueOnce({ mockLockId: 'mock-lock-id' })
		return EditLock.fetchByDraftId().then(() => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('created_at > now() - interval'),
				expect.anything()
			)
		})
	})

	test('fetchByDraftId returns null if query is empty', () => {
		db.oneOrNone.mockResolvedValueOnce(null)
		return EditLock.fetchByDraftId().then(result => {
			expect(result).toBe(null)
		})
	})

	test('fetchByDraftId calls the expected query with arguments', () => {
		db.oneOrNone.mockResolvedValueOnce({ mockLockId: 'mock-lock-id' })
		return EditLock.fetchByDraftId('mock-draft-id').then(() => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT'),
				expect.anything()
			)
			expect(db.oneOrNone).toHaveBeenCalledWith(expect.anything(), { draftId: 'mock-draft-id' })
		})
	})

	test('create checks for existing locks', () => {
		return EditLock.create().then(() => {
			expect(db.one).toHaveBeenCalledTimes(1)
			expect(db.one).toHaveBeenCalledWith(
				expect.stringContaining('created_at > now() - interval'),
				expect.anything()
			)
			expect(db.one).toHaveBeenCalledWith(
				expect.stringContaining('WHERE NOT EXISTS'),
				expect.anything()
			)
		})
	})

	test('create uses editLockExpireMinutes from config', () => {
		return EditLock.create().then(() => {
			expect(db.one).toHaveBeenCalledTimes(1)
			expect(db.one).toHaveBeenCalledWith(
				expect.stringContaining(`${MOCK_EXPIRE_MINUTES} minutes`),
				expect.anything()
			)
		})
	})

	test('create calls the expected query with arguments', () => {
		return EditLock.create('mock-user-id', 'mock-draft-id').then(() => {
			expect(db.one).toHaveBeenCalledTimes(1)
			expect(db.one).toHaveBeenCalledWith(expect.stringContaining('INSERT'), expect.anything())
			expect(db.one).toHaveBeenCalledWith(expect.anything(), {
				userId: 'mock-user-id',
				draftId: 'mock-draft-id'
			})
		})
	})

	test('create returns result from db.one', () => {
		db.one.mockResolvedValueOnce('mock-result')
		return EditLock.create('mock-draft-id').then(result => {
			expect(db.one).toHaveBeenCalledTimes(1)
			expect(result).toBe('mock-result')
		})
	})
})
