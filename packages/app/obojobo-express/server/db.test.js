const mockPgPromise = jest.fn()
const mockPgPromiseInstance = jest.fn()
const mockBlueBirdConfig = jest.fn()
jest.mock('./config') // to allow us to alter db.useBluebird
jest.mock('bluebird', () => ({ config: mockBlueBirdConfig }))
jest.mock('pg-promise', () => mockPgPromise)
const mockDB = {}
let config

describe('db', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
		mockPgPromise.mockReturnValue(mockPgPromiseInstance)
		mockPgPromiseInstance.mockReturnValue(mockDB)
		config = require('./config')
	})

	test('db initializes with common expectations', () => {
		const db = require('./db')
		expect(db).toBe(mockDB)
		expect(mockPgPromiseInstance).toHaveBeenCalledTimes(1)
		expect(mockPgPromiseInstance).toHaveBeenCalledWith(config.db)
	})

	test('db initializes w/o bluebird', () => {
		config.db.useBluebird = false
		require('./db')
		const pgPromise = require('pg-promise')
		expect(pgPromise).toHaveBeenCalledTimes(1)
		expect(pgPromise).toHaveBeenCalledWith({ noWarnings: true })
		expect(mockBlueBirdConfig).not.toHaveBeenCalled()
	})

	test('db initializes with bluebird', () => {
		config.db.useBluebird = true
		require('./db')
		const bluebird = require('bluebird')
		const pgPromise = require('pg-promise')
		expect(pgPromise).toHaveBeenCalledTimes(1)
		expect(pgPromise).toHaveBeenCalledWith({ noWarnings: true, promiseLib: bluebird })
		expect(mockPgPromiseInstance).toHaveBeenCalledTimes(1)
		expect(mockBlueBirdConfig).toHaveBeenCalledWith({ longStackTraces: true })
	})
})
