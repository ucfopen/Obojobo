// this file changed from before in strange ways - will have to revisit these tests for sure
jest.mock('react')
jest.mock('redux')
jest.mock('react-redux', () => ({
	Provider: jest.fn()
}))
jest.mock('redux-pack')
jest.mock('../shared/util/client-globals')

let React
let Redux // { createStore, applyMiddleware }
let ReactRedux // { Provider }
let ReduxPack // { middleware }

describe('react utils', () => {
	const originalQuerySelector = document.querySelector

	let reactUtils

	const mockReactComponent = {
		id: 'mockReactComponent'
	}
	const mockReactProps = {
		mockProp: 'mockVal'
	}
	const mockDomElement = {
		dataset: {
			reactProps: JSON.stringify(mockReactProps)
		}
	}
	const mockCreatedReactElement = { ...mockReactComponent, props: { ...mockReactProps } }
	const mockReducers = {
		mockReducerFunction: jest.fn()
	}
	const mockMiddleware = { middlewareKey: 'middlewareProp' }
	const mockStore = { storeKey: 'storeProp', getState: jest.fn().mockReturnValue({}) }

	beforeAll(() => {
		global.ReactDOM = {
			hydrate: jest.fn()
		}
	})

	beforeEach(() => {
		jest.resetAllMocks()

		React = require('react')
		Redux = require('redux')
		ReactRedux = require('react-redux')
		ReduxPack = require('redux-pack')

		document.querySelector = jest.fn()

		reactUtils = require('./react-utils')
	})

	afterAll(() => {
		delete global.ReactDOM
		document.querySelector = originalQuerySelector
	})

	test('hydrateElWithoutStore makes the correct library calls', () => {
		document.querySelector.mockReturnValueOnce(mockDomElement)
		React.createElement.mockReturnValueOnce(mockCreatedReactElement)

		reactUtils.hydrateElWithoutStore(mockReactComponent, 'mockSelector')

		expect(document.querySelector).toHaveBeenCalledTimes(1)
		expect(document.querySelector).toHaveBeenCalledWith('mockSelector')

		expect(React.createElement).toHaveBeenCalledTimes(1)
		expect(React.createElement).toHaveBeenCalledWith(mockReactComponent, mockReactProps)

		expect(global.ReactDOM.hydrate).toHaveBeenCalledTimes(1)
		expect(global.ReactDOM.hydrate).toHaveBeenCalledWith(mockCreatedReactElement, mockDomElement)
	})

	test('hydrateEl makes the correct library calls', () => {
		const mockSecondCreatedReactElement = {
			...mockCreatedReactElement,
			props: { differentPropsKey: 'differentPropsVal' }
		}

		document.querySelector.mockReturnValueOnce(mockDomElement)
		React.createElement
			.mockReturnValueOnce(mockCreatedReactElement)
			.mockReturnValueOnce(mockSecondCreatedReactElement)
		Redux.applyMiddleware.mockReturnValueOnce(mockMiddleware)
		Redux.createStore.mockReturnValueOnce(mockStore)

		reactUtils.hydrateEl(mockReactComponent, mockReducers, 'mockSelector')

		expect(document.querySelector).toHaveBeenCalledTimes(1)
		expect(document.querySelector).toHaveBeenCalledWith('mockSelector')

		expect(Redux.applyMiddleware).toHaveBeenCalledTimes(2)
		expect(Redux.applyMiddleware).toHaveBeenCalledWith(ReduxPack.middleware)

		// eslint-disable-next-line no-undefined
		expect(Redux.createStore).toHaveBeenCalledWith(mockReducers, mockReactProps, undefined)

		expect(React.createElement).toHaveBeenCalledTimes(2)
		expect(React.createElement.mock.calls[0]).toEqual([mockReactComponent])
		expect(React.createElement.mock.calls[1]).toEqual([
			ReactRedux.Provider,
			{ store: mockStore },
			mockCreatedReactElement
		])

		expect(global.ReactDOM.hydrate).toHaveBeenCalledTimes(1)
		expect(global.ReactDOM.hydrate).toHaveBeenCalledWith(
			mockSecondCreatedReactElement,
			mockDomElement
		)
	})

	test('propsToStore makes the correct library calls', () => {
		Redux.applyMiddleware.mockReturnValueOnce(mockMiddleware)
		Redux.createStore.mockReturnValueOnce(mockStore)

		const response = reactUtils.propsToStore(mockReducers, mockReactProps)
		expect(Redux.applyMiddleware).toHaveBeenCalledTimes(1)
		expect(Redux.applyMiddleware).toHaveBeenCalledWith(ReduxPack.middleware)

		expect(Redux.createStore).toHaveBeenCalledWith(mockReducers, mockReactProps, mockMiddleware)
		expect(response).toEqual(mockStore)
	})

	test('createCommonReactApp makes the correct library calls', () => {
		const mockSecondCreatedReactElement = {
			...mockCreatedReactElement,
			props: { differentPropsKey: 'differentPropsVal' }
		}

		React.createElement
			.mockReturnValueOnce(mockCreatedReactElement)
			.mockReturnValueOnce(mockSecondCreatedReactElement)

		const response = reactUtils.createCommonReactApp(mockReactComponent, mockStore)
		expect(React.createElement).toHaveBeenCalledTimes(2)
		expect(React.createElement.mock.calls[0]).toEqual([mockReactComponent])
		expect(React.createElement.mock.calls[1]).toEqual([
			ReactRedux.Provider,
			{ store: mockStore },
			mockCreatedReactElement
		])
		expect(response).toEqual(mockSecondCreatedReactElement)
	})

	test('convertPropsToString strips unnecessary values from a props object and returns a string', () => {
		const rawProps = {
			settings: [],
			cache: {},
			_locals: [],
			desiredKeyOne: 'desiredPropOne',
			desiredKeyTwo: 'desiredPropTwo'
		}

		const response = reactUtils.convertPropsToString(rawProps)
		expect(JSON.parse(response)).toEqual({
			desiredKeyOne: 'desiredPropOne',
			desiredKeyTwo: 'desiredPropTwo'
		})
	})

	test('populateClientGlobals ignores missing globals', () => {
		const clientGlobals = require('../shared/util/client-globals')
		expect(clientGlobals).not.toHaveProperty('key')
		reactUtils.populateClientGlobals({ nonGlobals: { key: 'value' } })
		expect(clientGlobals).not.toHaveProperty('key')
	})

	test('populateClientGlobals registers globals', () => {
		const clientGlobals = require('../shared/util/client-globals')
		expect(clientGlobals).not.toHaveProperty('key')
		reactUtils.populateClientGlobals({ globals: { key: 'value' } })
		expect(clientGlobals).toHaveProperty('key', 'value')
	})
})
