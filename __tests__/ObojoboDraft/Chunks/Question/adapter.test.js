jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import QuestionAdapter from '../../../../ObojoboDraft/Chunks/Question/adapter'

describe('Question adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		QuestionAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				mode: 'review',
				practice: false,
				solution: {
					id: '249138ca-be09-4ab5-b015-3a8107b4c79e',
					type: 'ObojoboDraft.Pages.Page',
					content: {},
					children: [
						{
							id: '7fa8ecca-cdd2-4cb8-ae55-5435db9fb05e',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'this is some example solution text',
											styleList: []
										},
										data: null
									}
								]
							},
							children: []
						}
					]
				}
			}
		}
		const model = new OboModel(attrs)

		QuestionAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const attrs = {
			content: {
				practice: false
			}
		}
		const a = new OboModel(attrs)
		const b = new OboModel({})

		QuestionAdapter.construct(a, attrs)
		QuestionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with solution', () => {
		const attrs = {
			content: {
				practice: false,
				solution: 'mocked-solution'
			}
		}
		const a = new OboModel(attrs)
		const b = new OboModel({})

		QuestionAdapter.construct(a, attrs)
		QuestionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const json = { content: {} }
		const attrs = {
			content: {
				practice: false
			}
		}
		const model = new OboModel(attrs)

		QuestionAdapter.construct(model, attrs)
		QuestionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toJSON builds a JSON representation with solution', () => {
		const json = { content: {} }
		const attrs = {
			content: {
				practice: false,
				solution: {
					id: '249138ca-be09-4ab5-b015-3a8107b4c79e',
					type: 'ObojoboDraft.Pages.Page',
					content: {},
					children: [
						{
							id: '7fa8ecca-cdd2-4cb8-ae55-5435db9fb05e',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'this is some example solution text',
											styleList: []
										},
										data: null
									}
								]
							},
							children: []
						}
					]
				}
			}
		}
		const model = new OboModel(attrs)
		OboModel.prototype.toJSON = jest.fn().mockReturnValueOnce({
			mockedToJSON: true
		})

		QuestionAdapter.construct(model, attrs)
		QuestionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
