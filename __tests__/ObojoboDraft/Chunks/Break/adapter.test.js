import BreakAdapter from '../../../../ObojoboDraft/Chunks/Break/adapter'
import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		let expected = { modelState: { width: 'normal' } }
		BreakAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { width: 'large' } }
		let expected = { modelState: { width: 'large' } }
		BreakAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('toText creates a text representation', () => {
		let model = { modelState: { width: 'large' } }
		let text = BreakAdapter.toText(model)

		expect(text).toEqual('---')
	})
})
