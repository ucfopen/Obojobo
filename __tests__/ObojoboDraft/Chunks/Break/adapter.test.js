import BreakAdapter from '../../../../ObojoboDraft/Chunks/Break/adapter'
import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

describe('ActionButton adapter', () => {
	test('construct without attributes', () => {
		let model = { modelState: {} }
		let expected = { modelState: { width: 'normal' } }
		BreakAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	test('construct with attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { width: 'large' } }
		let expected = { modelState: { width: 'large' } }
		BreakAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('toText returns dashes', () => {
		let model = { modelState: { width: 'large' } }
		let text = BreakAdapter.toText(model)

		expect(text).toEqual('---')
	})
})
