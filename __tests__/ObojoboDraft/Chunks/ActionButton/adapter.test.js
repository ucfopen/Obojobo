import ActionButtonAdapter from '../../../../ObojoboDraft/Chunks/ActionButton/adapter'
import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

describe('ActionButton adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		let expected = { modelState: { align: 'center', label: '' } }
		ActionButtonAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				label: 'Start Assessment',
				triggers: [
					{
						type: 'onClick',
						actions: [
							{
								type: 'assessment:startAttempt',
								value: {
									id: 'assessment'
								}
							}
						]
					}
				]
			}
		}
		let expected = { modelState: { label: 'Start Assessment', align: 'center' } }
		ActionButtonAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		ActionButtonAdapter.construct(a)
		ActionButtonAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can be converted to JSON', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				label: 'Start Assessment',
				triggers: [
					{
						type: 'onClick',
						actions: [
							{
								type: 'assessment:startAttempt',
								value: {
									id: 'assessment'
								}
							}
						]
					}
				]
			}
		}

		let expected = {
			content: {
				align: 'center',
				label: 'Start Assessment',
				triggers: [
					{
						actions: [
							{
								type: 'assessment:startAttempt',
								value: {
									id: 'assessment'
								}
							}
						],
						type: 'onClick'
					}
				]
			}
		}
		ActionButtonAdapter.construct(model, attrs)
		ActionButtonAdapter.toJSON(model, attrs)

		expect(attrs).toEqual(expected)
	})
})
