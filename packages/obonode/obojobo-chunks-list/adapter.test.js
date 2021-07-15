import ListAdapter from './adapter'

jest.mock('./list-styles')

import ListStyles from './list-styles'

import Common from 'obojobo-document-engine/src/scripts/common/index'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

const TextGroupAdapter = Common.chunk.textChunk.TextGroupAdapter

describe('ActionButton adapter', () => {
	test('construct builds without attributes', () => {
		// const model = { modelState: {} }
		const model = new OboModel({})
		// TextGroupAdapter.construct = jest.fn()

		ListAdapter.construct(model)

		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		// const model = { modelState: {} }
		const model = new OboModel({})
		const attrs = {
			content: {
				listStyles: 'mockStyle',
				spacing: 'compact'
			}
		}

		// TextGroupAdapter.construct = jest.fn()
		ListStyles.fromDescriptor = jest.fn().mockReturnValueOnce('mockStyle')

		ListAdapter.construct(model, attrs)

		expect(model.modelState).toMatchSnapshot()
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
