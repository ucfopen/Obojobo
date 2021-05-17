jest.mock('../../server/db')
jest.mock('../../server/config', () => ({
	general: {
		demoMode: {
			purgeMode: 'none',
			purgeDaysAgo: 8
		}
	}
}))
jest.mock('../../server/logger')
jest.mock('../../server/obo_events')

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

		config = oboRequire('server/config')
		db = oboRequire('server/db')
	})

	test('isPurgeEnabled defaults to false with no config purgeMode', () => {
		delete config.general.demoMode.purgeMode
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false by default', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config isnt set', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		delete config.general.demoMode.purgeDaysAgo
		expect(config.general.demoMode.purgeDaysAgo).toBeUndefined()
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is none', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeDaysAgo = 'none'
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is 0', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeDaysAgo = 0
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is false when config is 1', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeDaysAgo = 1
		expect(isPurgeEnabled()).toBe(false)
	})

	test('isPurgeEnabled is true when config purge mode set to history', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeMode = MODE_PURGE_HISTORY
		expect(isPurgeEnabled()).toBe(true)
	})

	test('isPurgeEnabled is true when config purge mode set to all', () => {
		const { isPurgeEnabled } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeMode = MODE_PURGE_ALL
		expect(isPurgeEnabled()).toBe(true)
	})

	test('purgeData doesnt delete data with purge mode empty', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		delete config.general.demoMode.purgeMode

		return purgeData().then(() => {
			expect(db.none).not.toHaveBeenCalled()
		})
	})

	test('purgeData doesnt delete data with purge mode none', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeMode = 'none'

		return purgeData().then(() => {
			expect(db.none).not.toHaveBeenCalled()
		})
	})

	test('purgeData deletes data with purge mode history', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeMode = MODE_PURGE_HISTORY

		return purgeData().then(() => {
			expect(db.none).toHaveBeenCalledTimes(9)
		})
	})

	test('purgeData deletes data with purge mode all', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		config.general.demoMode.purgeMode = MODE_PURGE_ALL

		return purgeData().then(() => {
			expect(db.none).toHaveBeenCalledTimes(15)
		})
	})

	test('demoPurgeDaysAgo deletes with the expected calculated date', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		const expectedDate = calculateDaysAgo(8)
		config.general.demoMode.purgeMode = MODE_PURGE_HISTORY

		return purgeData().then(() => {
			expect(db.none).toHaveBeenCalled()
			const sampleQueryVars = db.none.mock.calls[0][1]
			expect(sampleQueryVars).toHaveProperty('purgeDate')
			expect(sampleQueryVars.purgeDate.toString()).toBe(expectedDate.toString())
		})
	})

	test('demoPurgeDaysAgo defaults to 7', () => {
		expect.hasAssertions()
		const { purgeData } = oboRequire('server/util/purge_data')
		const expectedDate = calculateDaysAgo(7)
		config.general.demoMode.purgeMode = MODE_PURGE_HISTORY
		delete config.general.demoMode.purgeDaysAgo

		return purgeData().then(() => {
			expect(db.none).toHaveBeenCalled()
			const sampleQueryVars = db.none.mock.calls[0][1]
			expect(sampleQueryVars).toHaveProperty('purgeDate')
			expect(sampleQueryVars.purgeDate.toString()).toBe(expectedDate.toString())
		})
	})
})
