jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

jest.mock('../../../../src/scripts/common/text-group/text-group', () => {
	return require('../../../../__mocks__/text-group-adapter-mock').default
})
import TextGroup from '../../../../src/scripts/common/text-group/text-group'

import ActionButtonAdapter from '../../../../ObojoboDraft/Chunks/ActionButton/adapter'

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		const expected = { align: 'center', label: '' }
		ActionButtonAdapter.construct(model)

		expect(model.modelState).toEqual(expected)
	})

	test('construct builds with label attributes', () => {
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
		const model = new OboModel(attrs)
		const expected = { label: 'Start Assessment', align: 'center' }
		ActionButtonAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
	})

	test('construct builds with textGroup attributes', () => {
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
			textGroup: {
				mockTextGroupValue: 'mockText'
			},
			align: 'center'
		}

		const model = new OboModel(attrs)
		ActionButtonAdapter.construct(model, attrs)
		expect(model.modelState).toEqual(expected)
	})

	test('construct builds with align attributes', () => {
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
		const model = new OboModel(attrs)
		const expected = { label: 'Start Assessment', align: 'right' }
		ActionButtonAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
	})

	test('clone creates a copy without a textGroup', () => {
		const a = new OboModel({})
		const b = new OboModel({})

		ActionButtonAdapter.construct(a)
		ActionButtonAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with a textGroup', () => {
		const a = {
			content: {
				textGroup: 'mock-textgroup-data'
			}
		}
		const b = {
			content: {}
		}

		const modelA = new OboModel(a)
		const modelB = new OboModel(b)

		ActionButtonAdapter.construct(modelA, a)
		ActionButtonAdapter.clone(modelA, modelB)

		expect(modelA).not.toBe(modelB)
		expect(modelA.modelState).toEqual({
			align: 'center',
			textGroup: {
				mockTextGroupValue: 'mock-textgroup-data'
			}
		})
		expect(modelB.modelState).toEqual({
			align: 'center',
			textGroup: {
				mockTextGroupValue: 'mock-textgroup-data:cloned'
			}
		})
		expect(modelA.modelState.textGroup).not.toBe(modelB.modelState.textGroup)
		expect(modelA.modelState.textGroup).toBeInstanceOf(TextGroup)
		expect(modelB.modelState.textGroup).toBeInstanceOf(TextGroup)
	})

	test('toJSON builds a JSON representation with a label', () => {
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
		const model = new OboModel(attrs)

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
		const model = new OboModel(attrs)

		const expected = {
			content: {
				align: 'center',
				textGroup: {
					textGroupMockJSON: 'mockText'
				},
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
