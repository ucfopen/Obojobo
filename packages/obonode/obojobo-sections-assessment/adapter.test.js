jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model', () => {
	return require('obojobo-document-engine/__mocks__/obo-model-adapter-mock').default
})

import AssessmentAdapter from './adapter'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

describe('ObojoboDraft.Sections.Assessment adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		AssessmentAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
		// make sure the default model state values are supplied
		expect(model.modelState.attempts).toBe(Infinity)
		expect(model.modelState.review).toBe('never')
		expect(model.modelState.pace).toBe('all')
		// scoreActions is a ScoreActions class object - basically a regular object but not exactly
		expect(model.modelState.scoreActions).toEqual({ actions: [], originalActions: null })
		// rubric is an AssessmentRubric class object - basically a regular object but not exactly
		expect(model.modelState.rubric).toEqual({
			mods: [],
			originalRubric: {},
			rubric: {
				failedResult: 0,
				passedResult: '$attempt_score',
				passingAttemptScore: 0,
				unableToPassResult: null
			},
			type: 'attempt'
		})
	})

	test('construct builds with single-item pacing', () => {
		const attrs = {
			content: { pace: 'single' }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState.pace).toBe('single')
	})

	test('construct builds with N attempts and runs review transform function', () => {
		const attrs = {
			content: { attempts: 6, review: 'Always' }
		}
		const model = new OboModel(attrs)
		AssessmentAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(6)
		expect(model.modelState.review).toBe('always')
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
