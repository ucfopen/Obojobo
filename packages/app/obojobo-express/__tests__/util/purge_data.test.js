jest.mock('../../db')
jest.mock('../../config')
jest.mock('../../logger')
jest.mock('../../obo_events')

// make sure all Date objects use a static date
// mockStaticDate()

describe('Purge Data', () => {
	let config
	let db
	const moment = require('moment')
	const MODE_PURGE_HISTORY = 'DANGER-delete-HISTORY-data'
	const MODE_PURGE_ALL = 'DANGER-delete-ALL-data'
	const calculateDaysAgo = days => {
		return moment()
			.startOf('day')
			.subtract(days, 'days')
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		jest.restoreAllMocks()

		config = oboRequire('config')
		db = oboRequire('db')
	})
	afterEach(() => {})

	test('isPurgeEnabled is false by default', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config isnt set', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		delete config.general.demoPurgeMode
		expect(config.general.demoPurgeMode).toBeUndefined()
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is none', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = 'none'
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is 0', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = 0
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is 1', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = 1
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is true when config purge mode set to history', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = MODE_PURGE_HISTORY
		expect(isPurgeEnabled()).toBe(true)
	})

	test('isPurgeEnabled is true when config purge mode set to all', () => {
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = MODE_PURGE_ALL
		expect(isPurgeEnabled()).toBe(true)
	})

	test('purgeData doesnt delete data with purge mode empty', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('util/purge_data')
		delete config.general.demoPurgeMode
		purgeData().then(() => {
			expect(db.none).not.toHaveBeenCalled()
		})
	})

	test('purgeData doesnt delete data with purge mode none', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = 'none'
		purgeData().then(() => {
			expect(db.none).not.toHaveBeenCalled()
		})
	})

	test('purgeData deletes data with purge mode history', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = MODE_PURGE_HISTORY
		purgeData().then(() => {
			expect(db.none).toHaveBeenCalledTimes(9)
		})
	})

	test('purgeData deletes data with purge mode all', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('util/purge_data')
		config.general.demoPurgeMode = MODE_PURGE_ALL
		purgeData().then(() => {
			expect(db.none).toHaveBeenCalledTimes(15)
		})
	})

	test('demoPurgeDaysAgo deletes with the expected calculated date', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('util/purge_data')
		const expectedDate = calculateDaysAgo(7)
		config.general.demoPurgeMode = MODE_PURGE_HISTORY
		purgeData().then(() => {
			expect(db.none).toHaveBeenCalled()
			const sampleQueryVars = db.none.mock.calls[0][1]
			expect(sampleQueryVars).toHaveProperty('purgeDate')
			expect(sampleQueryVars.purgeDate.toString()).toBe(expectedDate.toString())
		})
	})

	test('demoPurgeDaysAgo defaults to 7', () => {
		expect.hasAssertions()
		delete config.general.demoPurgeDaysAgo
		const { purgeData } = oboRequire('util/purge_data')
		const expectedDate = calculateDaysAgo(7)
		config.general.demoPurgeMode = MODE_PURGE_HISTORY
		purgeData().then(() => {
			expect(db.none).toHaveBeenCalled()
			const sampleQueryVars = db.none.mock.calls[0][1]
			expect(sampleQueryVars).toHaveProperty('purgeDate')
			expect(sampleQueryVars.purgeDate.toString()).toBe(expectedDate.toString())
		})
	})
})
