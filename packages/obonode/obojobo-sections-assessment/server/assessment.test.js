// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`obojobo-express/${name}`)
}

jest.setMock('obojobo-express/logger', require('obojobo-express/__mocks__/logger'))
jest.setMock('obojobo-express/db', require('obojobo-express/__mocks__/db'))
jest.setMock(
	'ims-lti/src/extensions/outcomes',
	require('obojobo-express/__mocks__/ims-lti/src/extensions/outcomes')
)
jest.mock('obojobo-express/logger')
jest.mock('obojobo-express/db')
jest.mock('ims-lti/src/extensions/outcomes')
jest.mock('obojobo-express/lti')
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
let lti
let Assessment
let AssessmentModel
let AssessmentScore
let logger

describe('Assessment', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		db = require('obojobo-express/db')
		lti = require('obojobo-express/lti')
		Assessment = require('./assessment')
		AssessmentModel = require('./models/assessment')
		AssessmentScore = require('./models/assessment-score')
		logger = require('obojobo-express/logger')
		db.one.mockReset()
		db.manyOrNone.mockReset()
	})

	const makeMockAttempt = () => ({
		attempt_id: 'mockAttemptId',
		assessment_id: 'mockAssessmentId',
		draft_content_id: 'mockContentId',
		created_at: 'mockCreatedAt',
		completed_at: 'mockCompletedAt',
		state: 'mockState',
		result: {
			attemptScore: 'mockResult',
			questionScores: ['mockScore']
		},
		assessment_score: '15',
		score_details: 'mockScoreDetails',
		assessment_score_id: 'scoreId',
		attempt_number: '12'
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

	test('onStartVisit returns when there is no history', () => {
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

		return assessment.onStartVisit(req, {}, visitStartExtensions).then(() => {
			expect(visitStartExtensions).toEqual([])
		})
	})

	test('onStartVisit returns when there is no history with import option enabled', () => {
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

		return assessment.onStartVisit(req, {}, visitStartExtensions).then(() => {
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
	})

	test('onStartVisit returns when there IS history', () => {
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

		return assessment.onStartVisit(req, {}, visitStartExtensions).then(() => {
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
	})

	test('onStartVisit returns when there IS history', () => {
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

		return assessment.onStartVisit(req, {}, visitStartExtensions).then(() => {
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
	})
})
