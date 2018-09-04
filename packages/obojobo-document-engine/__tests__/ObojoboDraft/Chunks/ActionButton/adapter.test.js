jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import TextGroup from '../../../../src/scripts/common/text-group/text-group'
import StyleableText from '../../../../src/scripts/common/text/styleable-text'

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
				textGroup: [
					{
						text: {
							value: 'mock-tg'
						}
					}
				],
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
		const tg = new TextGroup(Infinity, { indent: 0 }, [{ text: new StyleableText('mock-tg') }])
		const expected = {
			textGroup: tg,
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
				textGroup: [
					{
						text: {
							value: 'mock-tg'
						}
					}
				]
			}
		}
		const b = {
			content: {}
		}

		const modelA = new OboModel(a)
		const modelB = new OboModel(b)

		ActionButtonAdapter.construct(modelA, a)
		ActionButtonAdapter.clone(modelA, modelB)

		const tgA = new TextGroup(Infinity, { indent: 0 }, [{ text: new StyleableText('mock-tg') }])
		const tgB = new TextGroup(Infinity, { indent: 0 }, [{ text: new StyleableText('mock-tg') }])

		expect(modelA).not.toBe(modelB)
		expect(modelA.modelState).toEqual({
			align: 'center',
			textGroup: tgA
		})
		expect(modelB.modelState).toEqual({
			align: 'center',
			textGroup: tgB
		})
		expect(modelA.modelState.textGroup).not.toBe(modelB.modelState.textGroup)
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
				textGroup: [
					{
						text: {
							value: 'mock-tg'
						}
					}
				],
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
				textGroup: [
					{
						text: {
							value: 'mock-tg',
							styleList: null
						},
						data: {
							indent: 0
						}
					}
				],
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
