import isRefRelatedTarget from './is-ref-related-target'

describe('isRefRelatedTarget', () => {
	test('Returns expected values', () => {
		const same = jest.fn()
		expect(isRefRelatedTarget({ relatedTarget: same }, { current: same })).toBe(true)
		expect(isRefRelatedTarget({ relatedTarget: jest.fn() }, { current: jest.fn() })).toBe(false)
	})
})
