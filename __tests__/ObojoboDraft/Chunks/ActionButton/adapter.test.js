import ActionButtonAdapter from '../../../../ObojoboDraft/Chunks/ActionButton/adapter'
import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		const expected = { modelState: { align: 'center', label: '' } }
		ActionButtonAdapter.construct(model)

		expect(model).toEqual(expected)
	})

	test('construct builds with label attributes', () => {
		const model = { modelState: {} }
		const attrs = {
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
		const expected = { modelState: { label: 'Start Assessment', align: 'center' } }
		ActionButtonAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('construct builds with textGroup attributes', () => {
		const model = { modelState: {} }
		const attrs = {
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
		const expected = {
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
		const model = { modelState: {} }
		const attrs = {
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
		const expected = { modelState: { label: 'Start Assessment', align: 'right' } }
		ActionButtonAdapter.construct(model, attrs)

		expect(model).toEqual(expected)
	})

	test('clone creates a copy without a textGroup', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		ActionButtonAdapter.construct(a)
		ActionButtonAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with a textGroup', () => {
		const a = {
			modelState: {
				textGroup: {
					clone: jest.fn().mockReturnValueOnce('mockClone')
				}
			}
		}
		const b = {
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
		const model = { modelState: {} }
		const attrs = {
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

		const expected = {
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
		const model = { modelState: {} }
		const attrs = {
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

		const expected = {
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
		const a = {
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

		const text = ActionButtonAdapter.toText(a)

		expect(text).toEqual('mockText')
	})
})
