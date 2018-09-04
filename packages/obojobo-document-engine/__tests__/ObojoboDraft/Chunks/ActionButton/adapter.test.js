import ActionButtonAdapter from '../../../../ObojoboDraft/Chunks/ActionButton/adapter'
import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		let expected = { modelState: { align: 'center', label: '' } }
		ActionButtonAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	test('construct builds with label attributes', () => {
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

	test('construct builds with textGroup attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				textGroup: 'mockText',
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
			modelState: {
				textGroup: 'mockTextGroup',
				align: 'center'
			}
		}

		TextGroup.fromDescriptor = jest.fn().mockReturnValueOnce('mockTextGroup')
		ActionButtonAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('construct builds with align attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				label: 'Start Assessment',
				align: 'right',
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
		let expected = { modelState: { label: 'Start Assessment', align: 'right' } }
		ActionButtonAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('clone creates a copy without a textGroup', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		ActionButtonAdapter.construct(a)
		ActionButtonAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with a textGroup', () => {
		let a = {
			modelState: {
				textGroup: {
					clone: jest.fn().mockReturnValueOnce('mockClone')
				}
			}
		}
		let b = {
			modelState: {
				textGroup: {}
			}
		}

		ActionButtonAdapter.construct(a)
		ActionButtonAdapter.clone(a, b)

		expect(a).not.toBe(b)
		// Does not produce identical modelStates due to mocking of recursive clone()
		// Would produce identical clone in code
		expect(a.modelState).toEqual({
			align: 'center',
			label: '',
			textGroup: { clone: expect.any(Function) }
		})
		expect(b.modelState).toEqual({
			align: 'center',
			label: '',
			textGroup: 'mockClone'
		})
	})

	test('toJSON builds a JSON representation with a label', () => {
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

	test('toJSON builds a JSON representation with a textGroup', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				textGroup: 'mockText',
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
				textGroup: 'mockTextGroup',
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

		TextGroup.fromDescriptor = jest.fn().mockReturnValueOnce({
			toDescriptor: jest.fn().mockReturnValueOnce('mockTextGroup')
		})

		ActionButtonAdapter.construct(model, attrs)
		ActionButtonAdapter.toJSON(model, attrs)

		expect(attrs).toEqual(expected)
	})

	test('toText creates a text representation', () => {
		let a = {
			modelState: {
				textGroup: {
					first: {
						text: {
							value: 'mockText'
						}
					}
				}
			}
		}

		let text = ActionButtonAdapter.toText(a)

		expect(text).toEqual('mockText')
	})
})
