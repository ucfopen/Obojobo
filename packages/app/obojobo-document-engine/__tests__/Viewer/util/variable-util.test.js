const VariableUtil = require('../../../src/scripts/viewer/util/variable-util').default

describe('VariableUtil', () => {
	const standardMockState = {
		contexts: {
			practice: {}
		}
	}

	const makeTypicalMockStateChanges = () => {
		const desiredContext = {
			values: {
				'node-id:var-id-1': 'val1',
				'node-id:var-id-2': 'val2'
			}
		}
		const mockState = {
			contexts: {
				practice: { ...desiredContext }
			}
		}
		return [mockState, desiredContext]
	}

	test('getKey condenses a provided ownerID and variable name to a string', () => {
		expect(VariableUtil.getKey('node-id', 'variable-name')).toBe('node-id:variable-name')
	})

	test('getStateForContext returns a requested context from a given state', () => {
		const [mockState, desiredContext] = makeTypicalMockStateChanges()
		expect(VariableUtil.getStateForContext(mockState, 'practice')).toEqual(desiredContext)
	})

	test('getStateForContext returns null if a requested context does not exist', () => {
		expect(VariableUtil.getStateForContext(standardMockState, 'some-context')).toBeNull()
	})

	test('hasValue returns false if a given state lacks a given context', () => {
		expect(VariableUtil.hasValue('some-context', standardMockState, '', '')).toBe(false)
	})

	test('hasValue returns false if a state context does not have the given variable owned by the given model id', () => {
		const [mockState] = makeTypicalMockStateChanges()
		expect(VariableUtil.hasValue('practice', mockState, 'some-other-node', 'var-id-1')).toBe(false)
	})

	test('hasValue returns true if a state context has the given variable owned by the given model id', () => {
		const [mockState] = makeTypicalMockStateChanges()
		expect(VariableUtil.hasValue('practice', mockState, 'node-id', 'var-id-1')).toBe(true)
	})

	test('getValue returns null if a given state lacks a given context', () => {
		expect(VariableUtil.getValue('some-context', standardMockState, '', '')).toBeNull()
	})

	test('getValue returns the value of the requested variable', () => {
		const [mockState] = makeTypicalMockStateChanges()
		expect(VariableUtil.getValue('practice', mockState, 'node-id', 'var-id-1')).toBe('val1')
		expect(VariableUtil.getValue('practice', mockState, 'node-id', 'var-id-2')).toBe('val2')
		// even when the requested variable isn't defined
		expect(VariableUtil.getValue('practice', mockState, 'node-id', 'var-id-3')).toBeUndefined()
	})

	// all getOwnerOfVariable calls will also call getStateForContext, which we can't really mock
	// it is what it is
	test('getOwnerOfVariable returns null if getStateForContext is falsy', () => {
		expect(
			VariableUtil.getOwnerOfVariable('some-context', standardMockState, null, null)
		).toBeNull()
	})

	test('getOwnerOfVariable returns the given model if it owns the requested variable', () => {
		const [mockState] = makeTypicalMockStateChanges()
		// ordinarily this would be an oboNode instance - .get would be just one method available
		// in the case of this test, it's the only one we care about
		const mockNodeGet = jest.fn().mockReturnValue('node-id')
		const mockNode = {
			get: mockNodeGet
		}
		expect(VariableUtil.getOwnerOfVariable('practice', mockState, mockNode, 'var-id-1')).toEqual(
			mockNode
		)
		expect(mockNodeGet).toHaveBeenCalledTimes(1)
		expect(mockNodeGet).toHaveBeenCalledWith('id')
	})

	test("getOwnerOfVariable returns the given model's parent if the parent owns the requested variable", () => {
		const [mockState] = makeTypicalMockStateChanges()
		// ordinarily this would be an oboNode instance - .get would be just one method available
		// in the case of this test, it's the only one we care about
		const mockNodeGet = jest.fn().mockReturnValue('some-other-node-id')
		const mockParentNodeGet = jest.fn().mockReturnValue('node-id')
		const mockParentNode = {
			get: mockParentNodeGet
		}
		const mockNode = {
			get: mockNodeGet,
			parent: mockParentNode
		}
		expect(VariableUtil.getOwnerOfVariable('practice', mockState, mockNode, 'var-id-1')).toEqual(
			mockParentNode
		)
		expect(mockNodeGet).toHaveBeenCalledTimes(1)
		expect(mockNodeGet).toHaveBeenCalledWith('id')
		expect(mockParentNodeGet).toHaveBeenCalledTimes(1)
		expect(mockParentNodeGet).toHaveBeenCalledWith('id')
	})

	test('getOwnerOfVariable returns null if neither the given model or its parent own the requested variable', () => {
		const [mockState] = makeTypicalMockStateChanges()
		// ordinarily this would be an oboNode instance - .get would be just one method available
		// in the case of this test, it's the only one we care about
		const mockNodeGet = jest.fn().mockReturnValue('some-other-node-id')
		const mockParentNodeGet = jest.fn().mockReturnValue('some-other-parent-node-id')
		const mockParentNode = {
			get: mockParentNodeGet
		}
		const mockNode = {
			get: mockNodeGet,
			parent: mockParentNode
		}
		expect(VariableUtil.getOwnerOfVariable('practice', mockState, mockNode, 'var-id-1')).toBeNull()
		expect(mockNodeGet).toHaveBeenCalledTimes(1)
		expect(mockNodeGet).toHaveBeenCalledWith('id')
		expect(mockParentNodeGet).toHaveBeenCalledTimes(1)
		expect(mockParentNodeGet).toHaveBeenCalledWith('id')
	})

	// all findValueWithModel calls will also call getStateForContext and getOwnerOfVariable and getValue
	// we can't mock those, but it is what it is
	test('findValueWithModel returns null if getStateForContext is falsy', () => {
		expect(VariableUtil.findValueWithModel('some-context', standardMockState, {}, '')).toBeNull()
	})

	test('findValueWithModel returns null if there is no owner for the requested variable', () => {
		const [mockState] = makeTypicalMockStateChanges()
		const mockNodeGet = jest.fn().mockReturnValue('some-other-node-id')
		const mockNode = {
			get: mockNodeGet
		}
		expect(VariableUtil.findValueWithModel('practice', mockState, mockNode, 'var-id-1')).toBeNull()
	})

	test('findValueWithModel returns the value of the requested variable correctly', () => {
		const [mockState] = makeTypicalMockStateChanges()
		const mockNodeGet = jest.fn().mockReturnValue('node-id')
		const mockNode = {
			get: mockNodeGet
		}
		expect(VariableUtil.findValueWithModel('practice', mockState, mockNode, 'var-id-1')).toEqual(
			'val1'
		)
	})

	// all getVariableStateSummary calls will also call getStateForContext, which we can't really mock
	// it is what it is
	test('getVariableStateSummary returns null if getStateForContext is falsy', () => {
		expect(VariableUtil.getVariableStateSummary('some-context', standardMockState)).toBeNull()
	})

	test('returns the variable values available in the state for a requested context', () => {
		const [mockState, desiredContext] = makeTypicalMockStateChanges()
		expect(VariableUtil.getVariableStateSummary('practice', mockState)).toEqual(
			desiredContext.values
		)
	})
})
