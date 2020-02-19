jest.mock('obojobo-express/server/db')
jest.mock('obojobo-express/server/logger')

const AssessmentScore = require('./assessment-score')
const db = require('obojobo-express/server/db')

describe('AssessmentScore', () => {
	let mockScoreResult

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		mockScoreResult = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6'
		}
	})

	test('constructor initializes expected properties', () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6',
			some_key: 1,
			some_other_key: 2
		}
		const score = new AssessmentScore(props)
		expect(score).toMatchInlineSnapshot(`
		AssessmentScore {
		  "assessmentScoreId": 34,
		  "id": 55,
		  "importedAssessmentScoreId": null,
		  "isImported": false,
		  "isPreview": false,
		  "score": 44.6,
		  "someKey": 1,
		  "someOtherKey": 2,
		}
	`)
	})

	test('fetchById returns AssessmentScore', async () => {
		db.one.mockResolvedValueOnce(mockScoreResult)
		const result = await AssessmentScore.fetchById('mock-id')
		expect(result).toMatchInlineSnapshot(`
		AssessmentScore {
		  "assessmentScoreId": 34,
		  "id": 55,
		  "importedAssessmentScoreId": null,
		  "isImported": false,
		  "isPreview": false,
		  "score": 44.6,
		}
	`)
	})

	test('fetchById logs errors', () => {
		db.one.mockRejectedValueOnce('mock-error')
		return expect(AssessmentScore.fetchById('mock-id')).rejects.toBe('mock-error')
	})

	test('getImportableScore returns AssessmentScore', async () => {
		db.oneOrNone.mockResolvedValueOnce(mockScoreResult)
		const result = await AssessmentScore.getImportableScore(
			'mock-user-id',
			'mock-content-id',
			'is-preview'
		)
		expect(result).toMatchInlineSnapshot(`
		AssessmentScore {
		  "assessmentScoreId": 34,
		  "id": 55,
		  "importedAssessmentScoreId": null,
		  "isImported": false,
		  "isPreview": false,
		  "score": 44.6,
		}
	`)
	})

	test('getImportableScore handles errors', () => {
		db.oneOrNone.mockRejectedValueOnce('mock-error')
		return expect(
			AssessmentScore.getImportableScore('mock-user-id', 'mock-content-id', 'is-preview')
		).rejects.toBe('mock-error')
	})

	test('getImportableScore doesnt return anything when theres no query results', async () => {
		db.oneOrNone.mockResolvedValueOnce(false)
		const result = await AssessmentScore.getImportableScore(
			'mock-user-id',
			'mock-content-id',
			'is-preview'
		)
		expect(result).toBe(undefined) // eslint-disable-line no-undefined
	})

	test('deletePreviewScores calls expected queries', async () => {
		db.manyOrNone.mockResolvedValueOnce([{ id: 5 }, { id: 99 }])
		db.none.mockResolvedValueOnce()
		db.none.mockResolvedValueOnce()

		await AssessmentScore.deletePreviewScores({
			transaction: db,
			userId: 'mock-user-id',
			draftId: 'mock-draft-id',
			resourceLinkId: 'resource-link-id'
		})

		expect(db.manyOrNone).toHaveBeenCalledTimes(1)
		expect(db.none).toHaveBeenCalledTimes(2)

		expect(db.manyOrNone.mock.calls).toMatchSnapshot()
		expect(db.none.mock.calls).toMatchSnapshot()
	})

	test('deletePreviewScores skips delete when theres nothing to delete', async () => {
		db.manyOrNone.mockResolvedValueOnce([])

		await AssessmentScore.deletePreviewScores({
			transaction: db,
			userId: 'mock-user-id',
			draftId: 'mock-draft-id',
			resourceLinkId: 'resource-link-id'
		})

		expect(db.none).toHaveBeenCalledTimes(0)
	})

	test('clone screates a new object', () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6',
			some_key: 1,
			some_other_key: 2
		}
		const score = new AssessmentScore(props)
		const copy = score.clone()

		expect(copy).toBeInstanceOf(AssessmentScore)
		expect(copy).not.toBe(score) // not ===
		expect(copy).toEqual(score) // but has same properties
	})

	test('create fails if id is given', () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6'
		}
		const score = new AssessmentScore(props)

		expect(() => score.create(db)).toThrowError('Cannot call create on a model that has an id.')
	})

	test('create calls insert and updates id', async () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6'
		}
		db.one.mockResolvedValueOnce({ id: 'new-id' })
		const score = new AssessmentScore(props)
		delete score.id // make sure it has no id

		const result = await score.create(db)

		expect(result).toBe(score) // should return itself for chaining
		expect(result.id).toBe('new-id') // should have the new id
	})

	test('create provides its own db ref', async () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6'
		}
		db.one.mockResolvedValueOnce({ id: 'new-id' })
		const score = new AssessmentScore(props)
		delete score.id // make sure it has no id

		const result = await score.create()

		expect(result).toBe(score) // should return itself for chaining
		expect(result.id).toBe('new-id') // should have the new id
	})


	test('importAsNewScore clones, preps, and creates a new score', async () => {
		const props = {
			id: '55',
			assessment_score_id: '34',
			score: '44.6',
			scoreDetails: {}
		}
		db.one.mockResolvedValueOnce({ id: 'new-id' })
		const score = new AssessmentScore(props)
		const createFn = jest.spyOn(score, 'create')

		const result = await score.importAsNewScore('mock-attempt-id', 'mock-resource-id', db)

		expect(createFn).toHaveBeenCalledTimes(1) // should have called insert query
		expect(result).not.toBe(score) // should be a new object
		expect(result).toHaveProperty('id', "new-id")
		expect(result).toHaveProperty('scoreDetails.attemptNumber', 1)
		expect(result).toHaveProperty('resourceLinkId', "mock-resource-id")
		expect(result).toHaveProperty('importedAssessmentScoreId', 55)
		expect(result).toHaveProperty('isImported', true)
		expect(result).toHaveProperty('attemptId', 'mock-attempt-id')


	})
})
