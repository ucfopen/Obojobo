import BreakAdapter from '../../../../ObojoboDraft/Chunks/Break/adapter'

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		const expected = { modelState: { width: 'normal' } }
		BreakAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = { content: { width: 'large' } }
		const expected = { modelState: { width: 'large' } }
		BreakAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('toText creates a text representation', () => {
		const model = { modelState: { width: 'large' } }
		const text = BreakAdapter.toText(model)

		expect(text).toEqual('---')
	})
})
