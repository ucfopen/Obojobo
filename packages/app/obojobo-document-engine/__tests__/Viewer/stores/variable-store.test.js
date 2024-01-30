const Common = require('../../../src/scripts/common/index').default

const Dispatcher = Common.flux.Dispatcher
jest.spyOn(Dispatcher, 'on')

const VariableStore = require('../../../src/scripts/viewer/stores/variable-store').default

// gotta hold on to this because beforeEach will clear it before the tests
const eventCallbacks = Dispatcher.on.mock.calls[0][0]

describe('VariableStore', () => {
	const standardMockVariables = [
		{ id: 'mock-node-id1:mock-var-name1', value: 'mock-var-value1' },
		{ id: 'mock-node-id1:mock-var-name2', value: 'mock-var-value2' }
	]

	beforeEach(() => {
		jest.clearAllMocks()
		VariableStore.setState()
	})

	test('registers events w/ dispatcher', () => {
		expect(eventCallbacks).toEqual({ 'variables:addContext': expect.any(Function) })
	})

	const verifyInitialConditions = () => {
		VariableStore.init(standardMockVariables)
		expect(VariableStore.getState()).toEqual({
			contexts: {
				practice: {
					values: {
						'mock-node-id1:mock-var-name1': 'mock-var-value1',
						'mock-node-id1:mock-var-name2': 'mock-var-value2'
					},
					varNamesByOwnerId: {
						'mock-node-id1': {
							'mock-var-name1': true,
							'mock-var-name2': true
						}
					}
				}
			}
		})
	}

	test('init automatically creates a "practice" context with given values', () => {
		verifyInitialConditions()
	})

	test('getContextState returns null for a context that does not exist', () => {
		VariableStore.init(standardMockVariables)
		expect(VariableStore.getContextState('invalid-context')).toBeNull()
	})

	test('hasContextState returns false for a context that does not exist', () => {
		VariableStore.init(standardMockVariables)
		expect(VariableStore.hasContextState('invalid-context')).toBe(false)
	})

	test('getOrCreateContextState will return a requested context if it exists', () => {
		VariableStore.init(standardMockVariables)
		expect(VariableStore.getOrCreateContextState('practice')).toEqual({
			values: {
				'mock-node-id1:mock-var-name1': 'mock-var-value1',
				'mock-node-id1:mock-var-name2': 'mock-var-value2'
			},
			varNamesByOwnerId: {
				'mock-node-id1': {
					'mock-var-name1': true,
					'mock-var-name2': true
				}
			}
		})
	})

	test('getOrCreateContextState will create a requested context if it does not exist', () => {
		VariableStore.init(standardMockVariables)
		expect(VariableStore.getOrCreateContextState('new-context')).toEqual({
			values: {},
			varNamesByOwnerId: {}
		})
	})

	test('variables:addContext callback adds variables to an existing context', () => {
		verifyInitialConditions()
		eventCallbacks['variables:addContext']({
			value: {
				context: 'practice',
				variables: [{ id: 'mock-node-id2:mock-var-name3', value: 'mock-var-value3' }]
			}
		})

		expect(VariableStore.getState()).toEqual({
			contexts: {
				practice: {
					values: {
						'mock-node-id1:mock-var-name1': 'mock-var-value1',
						'mock-node-id1:mock-var-name2': 'mock-var-value2',
						'mock-node-id2:mock-var-name3': 'mock-var-value3'
					},
					varNamesByOwnerId: {
						'mock-node-id1': {
							'mock-var-name1': true,
							'mock-var-name2': true
						},
						'mock-node-id2': {
							'mock-var-name3': true
						}
					}
				}
			}
		})
	})

	test('variables:addContext callback creates and adds variables to a new context', () => {
		verifyInitialConditions()
		eventCallbacks['variables:addContext']({
			value: {
				context: 'new-context',
				variables: [{ id: 'mock-node-id2:mock-var-name3', value: 'mock-var-value3' }]
			}
		})

		expect(VariableStore.getState()).toEqual({
			contexts: {
				practice: {
					values: {
						'mock-node-id1:mock-var-name1': 'mock-var-value1',
						'mock-node-id1:mock-var-name2': 'mock-var-value2'
					},
					varNamesByOwnerId: {
						'mock-node-id1': {
							'mock-var-name1': true,
							'mock-var-name2': true
						}
					}
				},
				'new-context': {
					values: {
						'mock-node-id2:mock-var-name3': 'mock-var-value3'
					},
					varNamesByOwnerId: {
						'mock-node-id2': {
							'mock-var-name3': true
						}
					}
				}
			}
		})
	})
})
