// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`obojobo-express/${name}`)
}

jest.setMock(
	'ims-lti/src/extensions/outcomes',
	require('obojobo-express/__mocks__/ims-lti/src/extensions/outcomes')
)
jest.mock('obojobo-express/server/logger')
jest.mock('obojobo-express/server/db')
jest.mock('ims-lti/src/extensions/outcomes')
jest.mock('obojobo-express/server/lti')
jest.mock(
	'../../__mocks__/models/visit',
	() => ({
		fetchById: jest.fn().mockReturnValue({ is_preview: false })
	}),
	{ virtual: true }
)
jest.mock('./models/assessment')
jest.mock('./models/assessment-score')

let db
let Assessment
let AssessmentModel
let AssessmentScore

describe('Assessment', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		Assessment = require('./assessment')
		AssessmentModel = require('./models/assessment')
		AssessmentScore = require('./models/assessment-score')
		db.one.mockReset()
		db.manyOrNone.mockReset()
	})

	test('nodeName is expected value', () => {
		expect(Assessment.nodeName).toBe('ObojoboDraft.Sections.Assessment')
	})

	test('creates its own instance correctly', () => {
		Assessment.prototype.registerEvents = jest.fn()

		const assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		expect(assessment.registerEvents).toHaveBeenCalledWith({
			'internal:sendToClient': assessment.onSendToClient,
			'internal:startVisit': assessment.onStartVisit
		})
	})

	test('onSendToClient yells', () => {
		const assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		jest.spyOn(assessment, 'yell')
		assessment.onSendToClient('req', 'res')

		expect(assessment.yell).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:sendToClient',
			'req',
			'res'
		)
	})

	test('onStartVisit returns when there is no history', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: { is_preview: false, score_importable: false }
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)
		const history = []

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce(history)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toEqual([])
	})

	test('onStartVisit returns when there is no history with import option enabled', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: { is_preview: false, score_importable: true }
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)
		const history = []
		const importableScore = {
			id: 'mock-score-id',
			score: 66.6666,
			createdAt: 'mock-date',
			assessmentId: 'mock-score-assessment-id',
			attemptId: 'mock-score-attempt-id'
		}

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce(history)
		jest.spyOn(AssessmentScore, 'getImportableScore').mockResolvedValueOnce(importableScore)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toHaveLength(1)
		expect(visitStartExtensions[0]).toHaveProperty('importableScore')
		expect(visitStartExtensions[0].importableScore).toMatchInlineSnapshot(`
		Object {
		  "assessmentDate": "mock-date",
		  "assessmentId": "mock-score-assessment-id",
		  "assessmentScoreId": "mock-score-id",
		  "attemptId": "mock-score-attempt-id",
		  "highestScore": 66.6666,
		}
	`)
	})

	test('onStartVisit returns when there IS history', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: { is_preview: false, score_importable: false }
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)
		const history = [
			{
				assessmentId: 'mock-assessment-id',
				attempts: [
					{
						assessmentScore: 10,
						isFinished: true,
						isImported: false
					},
					{
						assessmentScore: 88,
						isFinished: false,
						isImported: false
					}
				]
			}
		]

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce(history)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toHaveLength(1)
		expect(visitStartExtensions).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "assessmentSummary": Array [
		      Object {
		        "assessmentId": "mock-assessment-id",
		        "importUsed": false,
		        "scores": Array [
		          10,
		          88,
		        ],
		        "unfinishedAttemptId": undefined,
		      },
		    ],
		    "name": "ObojoboDraft.Sections.Assessment",
		  },
		]
	`)
	})

	test('onStartVisit returns when there IS history', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: {
				is_preview: false,
				score_importable: true,
				draft_content_id: 'mock-content-id'
			}
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)
		const history = [
			{
				assessmentId: 'mock-assessment-id',
				attempts: [
					{
						assessmentScore: 10,
						isFinished: true,
						isImported: false
					},
					{
						assessmentScore: 88,
						isFinished: false,
						isImported: false
					}
				]
			}
		]
		const importableScore = {
			id: 'mock-score-id',
			score: 66.6666,
			createdAt: 'mock-date',
			assessmentId: 'mock-score-assessment-id',
			attemptId: 'mock-score-attempt-id'
		}

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce(history)
		jest.spyOn(AssessmentScore, 'getImportableScore').mockResolvedValueOnce(importableScore)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toHaveLength(1)
		expect(visitStartExtensions).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "assessmentSummary": Array [
		      Object {
		        "assessmentId": "mock-assessment-id",
		        "importUsed": false,
		        "scores": Array [
		          10,
		          88,
		        ],
		        "unfinishedAttemptId": undefined,
		      },
		    ],
		    "name": "ObojoboDraft.Sections.Assessment",
		  },
		]
	`)
	})

	test('onStartVisit handles building history for multiple assessment ids', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: {
				is_preview: false,
				score_importable: false,
				draft_content_id: 'mock-content-id'
			}
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)
		const history = [
			{
				assessmentId: 'mock-assessment-id',
				attempts: [
					{
						assessmentScore: 10,
						isFinished: true,
						isImported: false
					}
				]
			},
			{
				assessmentId: 'mock-assessment-id',
				attempts: [
					{
						assessmentScore: 90,
						isFinished: true,
						isImported: false
					}
				]
			},
			{
				assessmentId: 'mock-assessment-id2',
				attempts: [
					{
						assessmentScore: 50,
						isFinished: true,
						isImported: true // to cover a branch for handling isImported
					}
				]
			}
		]
		const importableScore = {
			id: 'mock-score-id',
			score: 66.6666,
			createdAt: 'mock-date',
			assessmentId: 'mock-score-assessment-id',
			attemptId: 'mock-score-attempt-id'
		}

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce(history)
		jest.spyOn(AssessmentScore, 'getImportableScore').mockResolvedValueOnce(false)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toHaveLength(1)
		expect(visitStartExtensions).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "assessmentSummary": Array [
		      Object {
		        "assessmentId": "mock-assessment-id",
		        "importUsed": false,
		        "scores": Array [
		          10,
		          90,
		        ],
		        "unfinishedAttemptId": null,
		      },
		      Object {
		        "assessmentId": "mock-assessment-id2",
		        "importUsed": true,
		        "scores": Array [
		          50,
		        ],
		        "unfinishedAttemptId": null,
		      },
		    ],
		    "name": "ObojoboDraft.Sections.Assessment",
		  },
		]
	`)
	})

	test('onStartVisit handles no history and no importable scores', async () => {
		const req = {
			requireCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: { id: 'mockUser' },
			currentDocument: { draftId: 'draft-doc' },
			currentVisit: {
				is_preview: false,
				score_importable: true,
				draft_content_id: 'mock-content-id'
			}
		}
		const visitStartExtensions = []
		const draftTree = { draftTree: true }
		const node = { node: true }
		const initFn = jest.fn()
		const assessment = new Assessment(draftTree, node, initFn)

		jest.spyOn(AssessmentModel, 'fetchAttemptHistory').mockResolvedValueOnce([])
		jest.spyOn(AssessmentScore, 'getImportableScore').mockResolvedValueOnce(false)

		await assessment.onStartVisit(req, {}, visitStartExtensions)
		expect(visitStartExtensions).toHaveLength(0)
	})
})
