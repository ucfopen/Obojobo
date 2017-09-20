import oboGlobals from '../../../src/scripts/common/util/obo-globals'

describe('OboGlobals', () => {
	window.__oboGlobals = { 1: 'one', 2: 'two' }

	test('return value when on window', () => {
		expect(oboGlobals.get('1')).toBe('one')
		// ensure window is no longer set
		expect(window.__oboGlobals['1']).toBeUndefined()
	})

	test('return value when on window (given default argument)', () => {
		expect(oboGlobals.get('2', 'new')).toBe('two')
		// ensure window is no longer set
		expect(window.__oboGlobals['2']).toBeUndefined()
	})

	test('return value from globals map', () => {
		// ensure value is not being derived from window
		expect(window.__oboGlobals['1']).toBeUndefined()
		expect(oboGlobals.get('1')).toBe('one')
	})

	test('return value from globals map (given default argument)', () => {
		// ensure value is not being derived from window
		expect(window.__oboGlobals['2']).toBeUndefined()
		expect(oboGlobals.get('2', 'new')).toBe('two')
	})

	test('throw error if key does not exist in map or on window', () => {
		// ensure window value does not exist
		expect(window.__oboGlobals['3']).toBeUndefined()
		expect(() => oboGlobals.get('3')).toThrow('No Obo Global found for key 3')
	})

	test('return default argument (given default argument) when key does not exist in map or on window', () => {
		// ensure window value does not exist
		expect(window.__oboGlobals['3']).toBeUndefined()
		expect(oboGlobals.get('3', 'three')).toBe('three')
	})
})
