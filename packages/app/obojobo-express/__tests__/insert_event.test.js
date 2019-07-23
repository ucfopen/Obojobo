jest.mock('../db')

describe('insert_event', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetAllMocks()
	})
	afterEach(() => {})

	test('inserts the expected values', () => {
		expect.assertions(4)

		const db = oboRequire('db')
		const insertEvent = oboRequire('insert_event')
		const expectedCreatedAt = new Date().toISOString()
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
		expect.assertions(5)

		const db = oboRequire('db')
		const insertEvent = oboRequire('insert_event')
		const expectedCreatedAt = new Date().toISOString()
		const insertObject = {
			action: 'test::testAction',
			actorTime: new Date().toISOString(),
			payload: { value: 'test' },
			userId: 9,
			ip: '1.2.3.4',
			metadata: { value: 'test2' },
			draftId: '999999',
			caliperPayload: { id: 'mockCaliperPayload' }
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
				expect(db.none).toHaveBeenCalledTimes(1)
			})
			.catch(err => {
				throw err
			})
	})

	test('inserts the expected values with a caliper event (with extensions)', () => {
		expect.assertions(5)

		const db = oboRequire('db')
		const insertEvent = oboRequire('insert_event')
		const expectedCreatedAt = new Date().toISOString()
		const insertObject = {
			action: 'test::testAction',
			actorTime: new Date().toISOString(),
			payload: { value: 'test' },
			userId: 9,
			ip: '1.2.3.4',
			metadata: { value: 'test2' },
			draftId: '999999',
			caliperPayload: { id: 'mockCaliperPayload', extensions: {} }
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
				expect(db.none).toHaveBeenCalledTimes(1)
			})
			.catch(err => {
				throw err
			})
	})

	test('insert event handles visitId correctly', () => {
		expect.assertions(2)

		const db = oboRequire('db')
		const insertEvent = oboRequire('insert_event')
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
		expect.assertions(1)

		const db = oboRequire('db')
		const insertEvent = oboRequire('insert_event')
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
