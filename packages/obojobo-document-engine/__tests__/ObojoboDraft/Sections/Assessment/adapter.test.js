jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import AssessmentAdapter from 'ObojoboDraft/Sections/Assessment/adapter'

describe('ObojoboDraft.Sections.Assessment adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		AssessmentAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with N attempts', () => {
		const attrs = {
			content: { attempts: 6 }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(6)
	})

	test('construct builds with unlimited attempts', () => {
		const attrs = {
			content: { attempts: 'unlimited' }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(Infinity)
	})

	test('construct floors decimal attempt integers', () => {
		const attrs = {
			content: { attempts: 6.9 }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(6)
	})

	test('construct builds with legacy score actions', () => {
		// use the legacy action syntax
		const action = {
			from: 2,
			to: 4,
			page: 'mock-page'
		}

		const attrs = {
			content: { scoreActions: [action] }
		}
		const model = new OboModel(attrs)

		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 'mock-page',
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})
	})

	test('construct builds with score actions', () => {
		const action = {
			for: '[2,4]',
			page: 'mock-page'
		}

		const attrs = {
			content: { scoreActions: [action] }
		}
		const model = new OboModel(attrs)

		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 'mock-page',
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})
	})

	test('construct builds with rubric', () => {
		const attrs = {
			content: {
				rubric: {
					type: 'pass-fail'
				}
			}
		}
		const model = new OboModel(attrs)

		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			rubric: {
				type: 'pass-fail'
			}
		})
	})

	test('clone creates a copy', () => {
		const action = {
			for: '[2,4]',
			page: 'mock-page'
		}
		const attrs = {
			content: { scoreActions: [action] }
		}
		const model = new OboModel(attrs)
		const model2 = new OboModel({})
		AssessmentAdapter.construct(model, attrs)
		AssessmentAdapter.construct(model2, {})

		AssessmentAdapter.clone(model, model2)

		expect(model).not.toBe(model2)
		expect(model.modelState).not.toBe(model2.modelState)
		expect(model.modelState).toMatchObject(model2.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const action = {
			for: '[2,4]',
			page: 'mock-page'
		}
		const attrs = {
			content: { scoreActions: [action] }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)

		const json = { content: {} }
		AssessmentAdapter.toJSON(model, json)

		expect(json).toMatchObject({
			content: {
				attempts: Infinity,
				scoreActions: [
					{
						for: '[2,4]',
						page: 'mock-page'
					}
				]
			}
		})
	})
})
