import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import { Registry } from 'obojobo-document-engine/src/scripts/common/registry'

import QuestionAdapter from './adapter'

require('./viewer') // used to register this oboModel
require('obojobo-pages-page/viewer') // used to register the Page chunk as a dep
require('obojobo-chunks-text/viewer') // used to register the Text chunk as a dep
require('obojobo-chunks-multiple-choice-assessment/viewer') // used to register the MCAssessment chunk as a dep

describe('Question adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		QuestionAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with bad solution property', () => {
		const model = new OboModel({
			id: 'question',
			content: {
				solution: null
			}
		})
		QuestionAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			id: 'question',
			content: {
				type: 'default',
				correctLabels: 'a|b|c',
				incorrectLabels: 'x|y|z',
				revealAnswer: 'when-incorrect',
				solution: {
					id: 'solution',
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
		const spy = jest.spyOn(Registry, 'getItemForType').mockReturnValueOnce({})

		QuestionAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()

		spy.mockRestore()
	})

	test('clone creates a copy', () => {
		const attrs = {
			content: {
				correctLabels: 'a|b|c',
				incorrectLabels: 'd|e|f'
			}
		}
		const a = new OboModel(attrs)
		const b = new OboModel({})

		QuestionAdapter.construct(a, attrs)
		QuestionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toEqual(b.modelState)
		expect(a.modelState.correctLabels).toBeDefined()
		expect(a.modelState.incorrectLabels).toBeDefined()
	})

	test('clone creates a copy with solution', () => {
		const attrs = {
			content: {
				solution: {
					id: 'solution',
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
		const a = new OboModel(attrs)
		const b = new OboModel({})

		QuestionAdapter.construct(a, attrs)
		QuestionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toEqual(b.modelState)
		expect(a.modelState.solution).toBeDefined()
	})

	test('toJSON builds a JSON representation', () => {
		const json = { content: {} }
		const attrs = {
			content: {
				correctLabels: 'a|b|c',
				incorrectLabels: 'd|e|f',
				solution: {
					id: 'solution',
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
		QuestionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toJSON builds a JSON representation with correct/incorrect labels or a solution', () => {
		const json = { content: {} }
		const attrs = {
			content: {}
		}
		const model = new OboModel(attrs)

		QuestionAdapter.construct(model, attrs)
		QuestionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('Adapter grabs correctLabels and incorrectLabels from child components', () => {
		const attrs = {
			id: 'question',
			content: {
				correctLabels: 'a|b|c'
			},
			children: [
				{
					id: 'mcassessment',
					type: 'ObojoboDraft.Chunks.MCAssessment',
					content: {
						correctLabels: 'd|e|f',
						incorrectLabels: 'x|y|z'
					},
					children: []
				}
			]
		}

		const spy = jest.spyOn(Registry, 'getItemForType')
		spy.mockReturnValue({
			adapter: QuestionAdapter
		})

		const model = new OboModel(attrs)
		QuestionAdapter.construct(model, attrs)

		expect(model.modelState.correctLabels).toEqual(['a', 'b', 'c'])
		expect(model.modelState.incorrectLabels).toEqual(['x', 'y', 'z'])

		spy.mockRestore()
	})
})
