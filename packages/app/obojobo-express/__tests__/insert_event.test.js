jest.mock('../server/db', () => require('obojobo-document-engine/__mocks__/db'))
const db = oboRequire('server/db')
const insertEvent = oboRequire('server/insert_event')
const expectedCreatedAt = new Date().toISOString()

describe('insert_event', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	test('inserts the expected values', () => {
		expect.hasAssertions()

		const insertObject = {
			action: 'test::testAction',
			actorTime: new Date().toISOString(),
			payload: { value: 'test' },
			userId: 9,
			ip: '1.2.3.4',
			metadata: { value: 'test2' },
			draftId: '999999',
			contentId: '12'
		}
		// mock insert
		db.one.mockResolvedValueOnce({ created_at: expectedCreatedAt })

		return insertEvent(insertObject)
			.then(result => {
				expect(result).toHaveProperty('created_at')
				expect(result.created_at).toBe(expectedCreatedAt)
				expect(db.one).toHaveBeenCalledTimes(1)
				expect(db.one).toHaveBeenCalledWith(
					expect.stringContaining('INSERT INTO events'),
					insertObject
				)
			})
			.catch(err => {
				throw err
			})
	})

	test('inserts the expected values with a caliper event', () => {
		expect.hasAssertions()

		const insertObject = {
			action: 'test::testAction',
			actorTime: new Date().toISOString(),
			payload: { value: 'test' },
			userId: 9,
			ip: '1.2.3.4',
			metadata: { value: 'test2' },
			draftId: '999999'
		}
		// mock insert
		db.one.mockResolvedValueOnce({ created_at: expectedCreatedAt })

		return insertEvent(insertObject)
			.then(result => {
				expect(result).toHaveProperty('created_at')
				expect(result.created_at).toBe(expectedCreatedAt)
				expect(db.one).toHaveBeenCalledTimes(1)
				expect(db.one).toHaveBeenCalledWith(
					expect.stringContaining('INSERT INTO events'),
					insertObject
				)
			})
			.catch(err => {
				throw err
			})
	})

	test('inserts the expected values with a caliper event (with extensions)', () => {
		expect.hasAssertions()

		const insertObject = {
			action: 'test::testAction',
			actorTime: new Date().toISOString(),
			payload: { value: 'test' },
			userId: 9,
			ip: '1.2.3.4',
			metadata: { value: 'test2' },
			draftId: '999999'
		}
		// mock insert
		db.one.mockResolvedValueOnce({ created_at: expectedCreatedAt })

		return insertEvent(insertObject)
			.then(result => {
				expect(result).toHaveProperty('created_at')
				expect(result.created_at).toBe(expectedCreatedAt)
				expect(db.one).toHaveBeenCalledTimes(1)
				expect(db.one).toHaveBeenCalledWith(
					expect.stringContaining('INSERT INTO events'),
					insertObject
				)
			})
			.catch(err => {
				throw err
			})
	})

	test('insert event handles visitId correctly', () => {
		expect.hasAssertions()

		const insertObject = {}
		db.one.mockResolvedValue({})

		return insertEvent(insertObject)
			.then(() => {
				expect(insertObject['visitId']).toBe(null)
				insertObject.visitId = 'someId'
				return insertEvent(insertObject)
			})
			.then(() => expect(insertObject['visitId']).toBe('someId'))
	})

	test('Returns promise rejection', () => {
		expect.hasAssertions()

		const err = new Error('const error')
		// mock insert
		db.one.mockRejectedValueOnce(err)

		return insertEvent({})
			.then(created_at => {
				expect(true).toBe('this should never run')
				expect(created_at).toBeNull()
			})
			.catch(err => {
				expect(err).toBeInstanceOf(Error)
			})
	})
})
