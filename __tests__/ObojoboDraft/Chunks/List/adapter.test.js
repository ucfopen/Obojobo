import ListAdapter from '../../../../ObojoboDraft/Chunks/List/adapter'

jest.mock('../../../../ObojoboDraft/Chunks/List/list-styles')

import ListStyles from '../../../../ObojoboDraft/Chunks/List/list-styles'
import Common from 'Common'

const TextGroupAdapter = Common.chunk.textChunk.TextGroupAdapter

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }

		TextGroupAdapter.construct = jest.fn()

		ListAdapter.construct(model)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				listStyles: 'mockStyle'
			}
		}

		TextGroupAdapter.construct = jest.fn()
		ListStyles.fromDescriptor = jest.fn().mockReturnValueOnce('mockStyle')

		ListAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = {
			modelState: {
				listStyles: {
					clone: jest.fn().mockReturnValueOnce('mockClone')
				}
			}
		}
		const b = {
			modelState: {
				listStyles: null
			}
		}

		TextGroupAdapter.clone = jest.fn()

		ListAdapter.clone(a, b)

		expect(b).not.toBe(a)
		// Does not produce identical modelStates due to mocking of recursive clone()
		// Would produce identical clone in code
		expect(a).toEqual({
			modelState: {
				listStyles: {
					clone: expect.any(Function)
				}
			}
		})
		expect(b).toEqual({
			modelState: {
				listStyles: 'mockClone'
			}
		})
	})

	test('toJSON builds a JSON representation', () => {
		const model = {
			modelState: {
				listStyles: {
					toDescriptor: jest.fn().mockReturnValueOnce('mockDescriptor')
				}
			}
		}

		const json = {
			content: {
				listStyles: null
			}
		}

		TextGroupAdapter.toJSON = jest.fn()

		ListAdapter.toJSON(model, json)

		expect(json).toEqual({
			content: {
				listStyles: 'mockDescriptor'
			}
		})
	})

	test('toText creates a text representation', () => {
		const model = {
			modelState: {
				textGroup: {
					items: [
						{
							text: {
								value: 'mockItem'
							}
						}
					]
				}
			}
		}

		const text = ListAdapter.toText(model)

		expect(text).toEqual('  * mockItem\n')
	})
})
