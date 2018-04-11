import {
	endAttempt,
	getAttemptInfo,
	getAttemptHistory,
	getResponseHistory,
	getCalculatedScores,
	calculateScores,
	updateAttempt,
	insertAttemptEndEvents,
	sendLTIScore,
	insertAttemptScoredEvents,
	getNodeQuestion,
	recreateChosenQuestionTree,
	reloadState
} from '../../server/attempt-end.js'

import config from '../../../../config'
import db from '../../../../db'
import DraftModel from '../../../../models/draft'
import Assessment from '../../server/assessment'
import insertEvent from '../../../../insert_event'
import lti from '../../../../lti'

import testJson from '../../test-object.json'

const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')

jest.mock('uuid')


jest.mock('../../../../config', () => {
	return {
		db: {
			host: 'host',
			port: 'port',
			database: 'database',
			user: 'user',
			password: 'password'
		}
	}
})

jest.mock('../../../../lti', () => {
	return {
		replaceResult: jest.fn()
	}
})

jest.mock('../../../../db', () => {
	return {
		one: jest.fn(),
		manyOrNone: jest.fn(),
		any: jest.fn(),
		none: jest.fn()
	}
})

jest.mock('../../../../insert_event')

jest.mock('../../server/assessment', () => {
	return {
		getCompletedAssessmentAttemptHistory: jest.fn(),
		updateAttempt: jest.fn(),
		updateAttemptState: jest.fn(),
		getAttempts: jest.fn()
	}
})

describe('Attempt End', () => {
	const initMockUsedQuestionMap = map => {
		map.set('qb1', 0)
		map.set('qb1.q1', 0)
		map.set('qb1.q2', 0)
		map.set('qb2', 0)
		map.set('qb2.q1', 0)
		map.set('qb2.q2', 0)
	}

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test.skip('getAttemptInfo returns an object of attempt info', done => {
		db.one.mockImplementationOnce(() => {
			return Promise.resolve({
				draft_id: 'test_draft_id',
				assessment_id: 'test_assessment_id',
				attempt_state: {
					testAttemptState: 'testStateValue'
				}
			})
		})

		getAttemptInfo(1)
			.then(info => {
				expect(info).toEqual({
					assessmentId: 'test_assessment_id',
					attemptState: { testAttemptState: 'testStateValue' },
					draftId: 'test_draft_id',
					model: new DraftModel(),
					assessmentModel: { mockChild: 'test_assessment_id' }
				})

				done()
			})
			.catch(e => console.error(e))
	})

	test.skip('getAttemptHistory calls Assessment method', () => {
		getAttemptHistory('userId', 'draftId', 'assessmentId')
		expect(Assessment.getCompletedAssessmentAttemptHistory).toHaveBeenLastCalledWith(
			'userId',
			'draftId',
			'assessmentId'
		)
	})

	test.skip('getResponseHistory', () => {
		getResponseHistory('attemptId')
		expect(db.any.mock.calls[0][1][0]).toEqual('attemptId')
	})

	test.skip('getCalculatedScores', done => {
		// Setup: Assessment with two questions (q1 and q2)
		// First attempt: q1 = 60%, q2 = 100%, attempt = 80%
		// This attempt: q1 = 0%, q2 = 100%, attempt should be 50%
		// Result should be an assessment score of 80% (highest)
		// but this attempt should be a 50%

		let req = jest.fn()
		let res = jest.fn()
		let assessmentModel = {
			yell: (eventType, req, res, assessmentModel, responseHistory, event) => {
				event.addScore('q1', 0)
				event.addScore('q2', 100)
				return []
			},
			node: {
				content: {
					attempts: 10
				}
			}
		}
		let attemptState = {
			questions: [
				{
					id: 'q1'
				},
				{
					id: 'q2'
				}
			]
		}
		let attemptHistory = [
			{
				result: {
					scores: [
						{
							id: 'q1',
							score: 60
						},
						{
							id: 'q2',
							score: 100
						}
					],
					attemptScore: 80,
					assessmentScore: 0
				}
			}
		]
		let responseHistory = jest.fn()

		getCalculatedScores(req, res, assessmentModel, attemptState, attemptHistory, responseHistory)
			.then(result => {
				expect(result).toEqual({
					attemptScore: 50,
					assessmentScore: 80,
					ltiScore: 0.8,
					questionScores: [
						{
							id: 'q1',
							score: 0
						},
						{
							id: 'q2',
							score: 100
						}
					]
				})

				done()
			})
			.catch(e => console.error(e))
	})

	test.skip('updateAttempt calls Assessment model method', () => {
		updateAttempt('attemptId', 'attemptResult')
		expect(Assessment.updateAttempt).toHaveBeenLastCalledWith('attemptResult', 'attemptId')
	})

	test.skip('insertAttemptEndEvents calls insertEvent with expected params (preview mode = true)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptEndEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			true,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptEnd',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: -1
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/user/userId',
				action: 'Submitted',
				object: 'https://hostname/api/assessment/draftId/assessmentId',
				generated: 'https://hostname/api/attempt/attemptId',
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: { previewMode: true },
				type: 'AssessmentEvent'
			}
		})

		done()
	})

	test.skip('insertAttemptEndEvents calls insertEvent with expected params (preview mode = false)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptEndEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			false,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptEnd',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: 'attemptNumber'
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/user/userId',
				action: 'Submitted',
				object: 'https://hostname/api/assessment/draftId/assessmentId',
				generated: 'https://hostname/api/attempt/attemptId',
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: { previewMode: false },
				type: 'AssessmentEvent'
			}
		})

		done()
	})

	test.skip('insertAttemptScoredEvents calls insertEvent with expected params (preview mode = true, isScoreSent = false)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptScoredEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			55,
			65,
			true,
			false,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptScored',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: -1,
				attemptScore: 55,
				assessmentScore: -1,
				didSendLtiOutcome: false
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/server',
				action: 'Graded',
				object: 'https://hostname/api/attempt/attemptId',
				generated: {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					attempt: 'https://hostname/api/attempt/attemptId',
					dateCreated: 'date',
					id: 'test-uuid',
					maxScore: 100,
					scoreGiven: 55,
					scoredBy: 'https://hostname/api/server',
					type: 'Score'
				},
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: {
					previewMode: true,
					attemptCount: -1,
					attemptScore: 55,
					assessmentScore: -1,
					didSendLtiOutcome: false
				},
				type: 'GradeEvent'
			}
		})

		done()
	})

	test.skip('insertAttemptScoredEvents calls insertEvent with expected params (preview mode = true, isScoreSent = true)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptScoredEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			55,
			65,
			true,
			true,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptScored',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: -1,
				attemptScore: 55,
				assessmentScore: -1,
				didSendLtiOutcome: true
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/server',
				action: 'Graded',
				object: 'https://hostname/api/attempt/attemptId',
				generated: {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					attempt: 'https://hostname/api/attempt/attemptId',
					dateCreated: 'date',
					id: 'test-uuid',
					maxScore: 100,
					scoreGiven: 55,
					scoredBy: 'https://hostname/api/server',
					type: 'Score'
				},
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: {
					previewMode: true,
					attemptCount: -1,
					attemptScore: 55,
					assessmentScore: -1,
					didSendLtiOutcome: true
				},
				type: 'GradeEvent'
			}
		})

		done()
	})

	test.skip('insertAttemptScoredEvents calls insertEvent with expected params (preview mode = false, isScoreSent = false)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptScoredEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			55,
			65,
			false,
			false,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptScored',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: 'attemptNumber',
				attemptScore: 55,
				assessmentScore: 65,
				didSendLtiOutcome: false
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/server',
				action: 'Graded',
				object: 'https://hostname/api/attempt/attemptId',
				generated: {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					attempt: 'https://hostname/api/attempt/attemptId',
					dateCreated: 'date',
					id: 'test-uuid',
					maxScore: 100,
					scoreGiven: 55,
					scoredBy: 'https://hostname/api/server',
					type: 'Score'
				},
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: {
					previewMode: false,
					attemptCount: 'attemptNumber',
					attemptScore: 55,
					assessmentScore: 65,
					didSendLtiOutcome: false
				},
				type: 'GradeEvent'
			}
		})

		done()
	})

	test.skip('insertAttemptScoredEvents calls insertEvent with expected params (preview mode = false, isScoreSent = true)', done => {
		let toISOString = Date.prototype.toISOString

		Date.prototype.toISOString = () => 'date'

		insertAttemptScoredEvents(
			{ id: 'userId' },
			'draftId',
			'assessmentId',
			'attemptId',
			'attemptNumber',
			55,
			65,
			false,
			true,
			'hostname',
			'remoteAddress'
		)

		Date.prototype.toISOString = toISOString

		expect(insertEvent).toHaveBeenLastCalledWith({
			action: 'assessment:attemptScored',
			actorTime: 'date',
			payload: {
				attemptId: 'attemptId',
				attemptCount: 'attemptNumber',
				attemptScore: 55,
				assessmentScore: 65,
				didSendLtiOutcome: true
			},
			userId: 'userId',
			ip: 'remoteAddress',
			metadata: {},
			draftId: 'draftId',
			eventVersion: '1.1.0',
			caliperPayload: {
				'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
				actor: 'https://hostname/api/server',
				action: 'Graded',
				object: 'https://hostname/api/attempt/attemptId',
				generated: {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					attempt: 'https://hostname/api/attempt/attemptId',
					dateCreated: 'date',
					id: 'test-uuid',
					maxScore: 100,
					scoreGiven: 55,
					scoredBy: 'https://hostname/api/server',
					type: 'Score'
				},
				eventTime: 'date',
				edApp: 'https://hostname/api/system',
				id: 'test-uuid',
				extensions: {
					previewMode: false,
					attemptCount: 'attemptNumber',
					attemptScore: 55,
					assessmentScore: 65,
					didSendLtiOutcome: true
				},
				type: 'GradeEvent'
			}
		})

		done()
	})

	test.skip('sendLTIScore resolves as false if no score given', done => {
		sendLTIScore({ id: 'userId' }, 'draftId', null).then(result => {
			expect(result).toBe(false)
			done()
		})
	})

	test.skip('sendLTIScore calls lti.replaceResult if given a score', () => {
		sendLTIScore({ id: 'userId' }, 'draftId', 78)
		expect(lti.replaceResult).toHaveBeenLastCalledWith('userId', 'draftId', 78)
	})

	it.skip('calculateScores keeps all scores in order', () => {
		// this needs to make sure sends allScores into getAssessmentScoreInfoForAttempt IN ORDER (oldest to newest)
	})

	test.skip('@TODO - Need to make sure that these tests log correct', () => {
		//Don't actually write this test - this is just a reminder
		//that we need to add log mocks to the other tests in this file
	})

	test.skip('getAttempt returns an expected object', () => {
		//@TODO
	})

	test.skip('getCalculatedScores calls calculateScores with expected values', () => {
		//@TODO
	})

	test.skip('calculateScores calls rubric.getAssessmentScoreInfoForAttempt with expected values', () => {
		//@TODO
	})

	test.skip('calculateScores returns expected object', () => {
		//@TODO
	})

	test.skip('completeAttempt calls Assessment.completeAttempt with expected values', () => {
		//@TODO
	})

	test.skip('insertAttemptEndEvents creates a correct caliper event and internal event', () => {
		//@TODO
	})

	test.skip('insertAttemptScoredEvents creates a correct caliper event and internal event', () => {
		//@TODO
	})

	test('getNodeQuestion reloads score', () => {
		const mockDraft = new Draft(testJson)
		const mockQuestion = {
			"id": "qb1.q1",
			"type": "ObojoboDraft.Chunks.Question",
			"children": [{
				"id": "e3d455d5-80dd-4df8-87cf-594218016f44",
				"type": "ObojoboDraft.Chunks.Text",
				"content": {},
				"children": []
				},{
				"id": "qb1-q1-mca",
				"type": "ObojoboDraft.Chunks.MCAssessment",
				"content": {},
				"children": [{
					"id": "qb1-q1-mca-mc1",
					"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
					"content": {"score": 0}
				}]
			}]
		}

		expect(mockQuestion.id).toBe("qb1.q1")
		expect(mockQuestion.children[1].children[0].content.score).toBe(0)

		let reloadedQuestion = getNodeQuestion(mockQuestion.id, mockDraft)

		expect(reloadedQuestion.id).toBe(mockQuestion.id)
		expect(reloadedQuestion.children[1].children[0].content.score).toBe(100)
	})

	test('recreateChosenQuestionTree parses down a one-level question bank', () => {
		const mockDraft = new Draft(testJson)
		const mockQB = {
			"id":"qb.lv1",
			"type":"ObojoboDraft.Chunks.QuestionBank",
			"children":[
				{"id": "qb1.q1",
				"type": "ObojoboDraft.Chunks.Question",
				"children":[]
				}
			]
		}

		expect(mockQB.children.length).toBe(1)
		expect(mockQB.children[0].children.length).toBe(0)

		let traversedQB = recreateChosenQuestionTree(mockQB, mockDraft)

		expect(mockQB.children.length).toBe(1)
		expect(mockQB.children[0].children.length).not.toBe(0)
	})

	test('recreateChosenQuestionTree parses down a multi-level question bank', () => {
		const mockDraft = new Draft(testJson)
		const mockQB = {
			"id":"qb.lv1",
			"type":"ObojoboDraft.Chunks.QuestionBank",
			"children":[
				{"id":"qb.lv2",
				"type":"ObojoboDraft.Chunks.QuestionBank",
				"children":[
					{"id":"qb.lv3",
					"type":"ObojoboDraft.Chunks.QuestionBank",
					"children":[
						{"id": "qb1.q1",
						"type": "ObojoboDraft.Chunks.Question",
						"children":[]}
					]}
				]}
			]
		}

		expect(mockQB.children.length).toBe(1)
		expect(mockQB.children[0].children.length).toBe(1)
		expect(mockQB.children[0].children[0].children.length).toBe(1)
		expect(mockQB.children[0].children[0].children[0].children.length).toBe(0)

		let traversedQB = recreateChosenQuestionTree(mockQB, mockDraft)

		expect(mockQB.children.length).toBe(1)
		expect(mockQB.children[0].children.length).toBe(1)
		expect(mockQB.children[0].children[0].children.length).toBe(1)
		expect(mockQB.children[0].children[0].children[0].children.length).not.toBe(0)
	})

	test('reloadState does not reload when reviews are not allowed', () => {
		const mockProperties = {}
		const mockAttempt = {
			"assessmentModel":{
				"node":{
					"content":{
						"review":"never"
					}
				}
			}
		}

		let response = reloadState(0, 0, mockProperties, mockAttempt)

		expect(response).toBe(null)
	})

	test('reloadState does not reload when reviews are allowed after attempts, but it is not the last attempt', () => {
		const mockProperties = {}
		const mockAttempt = {
			"number":1,
			"assessmentModel":{
				"node":{
					"content":{
						"review":"afterAttempts",
						"attempts":3
					}
				}
			}
		}

		let response = reloadState(0, 0, mockProperties, mockAttempt)

		expect(response).toBe(null)
	})

	test('reloadState reloads only one when reviews are always allowed', () => {
		const mockDraft = new Draft(testJson)
		const assessmentNode = mockDraft.getChildNodeById('assessment')
		const assessmentQbTree = assessmentNode.children[1].toObject()
		const mockUsedQuestionMap = new Map()
		initMockUsedQuestionMap(mockUsedQuestionMap)

		mockUsedQuestionMap.set('qb2', 1)
		mockUsedQuestionMap.set('qb2.q1', 1)
		mockUsedQuestionMap.set('qb2.q2', 1)

		const mockProperties = {
			draftTree: mockDraft,
			id: null,
			oboNode: assessmentNode,
			nodeChildrenIds: null,
			assessmentQBTree: assessmentQbTree,
			attemptHistory: null,
			numAttemptsTaken: null,
			childrenMap: mockUsedQuestionMap
		}
		const mockAttempt = {
			"number":1,
			"assessmentModel":{
				"node":{
					"content":{
						"review":"always",
						"attempts":3
					}
				}
			}
		}

		let response = reloadState(0, 0, mockProperties, mockAttempt)

		expect(Assessment.updateAttemptState).toHaveBeenCalled()
	})

	test('reloadState reloads all when reviews are allowed after last', () => {
		const mockDraft = new Draft(testJson)
		const assessmentNode = mockDraft.getChildNodeById('assessment')
		const assessmentQbTree = assessmentNode.children[1].toObject()
		const mockUsedQuestionMap = new Map()
		initMockUsedQuestionMap(mockUsedQuestionMap)

		mockUsedQuestionMap.set('qb2', 1)
		mockUsedQuestionMap.set('qb2.q1', 1)
		mockUsedQuestionMap.set('qb2.q2', 1)

		const mockProperties = {
			user: {"id":0},
			draftTree: mockDraft,
			id: 0,
			oboNode: assessmentNode,
			nodeChildrenIds: null,
			assessmentQBTree: assessmentQbTree,
			attemptHistory: null,
			numAttemptsTaken: null,
			childrenMap: mockUsedQuestionMap
		}
		const mockAttempt = {
			"number":3,
			"assessmentModel":{
				"node":{
					"content":{
						"review":"afterAttempts",
						"attempts":3
					}
				}
			}
		}

		Assessment.getAttempts.mockImplementationOnce(() => Promise.resolve({
			"attempts":[
				{"state":
					{"qb": {
						"id":"qb.lv1",
						"type":"ObojoboDraft.Chunks.QuestionBank",
						"children":[
							{"id":"qb.lv2",
							"type":"ObojoboDraft.Chunks.QuestionBank",
							"children":[
								{"id":"qb.lv3",
								"type":"ObojoboDraft.Chunks.QuestionBank",
								"children":[
									{"id": "qb1.q1",
									"type": "ObojoboDraft.Chunks.Question",
									"children":[]}
								]}
							]}
						]
					},
					"questions": [
						{"id": "qb1.q1"}
					]
				}
			}]
		}))

		let response = reloadState(0, 0, mockProperties, mockAttempt)

		expect(Assessment.updateAttemptState).toHaveBeenCalled()
		expect(Assessment.getAttempts).toHaveBeenCalled()
	})
})
