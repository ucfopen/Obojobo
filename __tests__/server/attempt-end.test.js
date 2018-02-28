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
	insertAttemptScoredEvents
} from '../../server/attempt-end'
import config from '../../../../config'
import db from '../../../../db'
import DraftModel from '../../../../models/draft'
import Assessment from '../../server/assessment'
import insertEvent from '../../../../insert_event'
import lti from '../../../../lti'

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

jest.mock('../../../../models/draft')

jest.mock('../../server/assessment', () => {
	return {
		getCompletedAssessmentAttemptHistory: jest.fn(),
		updateAttempt: jest.fn()
	}
})

describe('Attempt End', () => {
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
			'assessmentId',
			false
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

	test.skip(
		'insertAttemptEndEvents calls insertEvent with expected params (preview mode = true)',
		done => {
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
		}
	)

	test.skip(
		'insertAttemptEndEvents calls insertEvent with expected params (preview mode = false)',
		done => {
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
		}
	)

	test.skip(
		'insertAttemptScoredEvents calls insertEvent with expected params (preview mode = true, isScoreSent = false)',
		done => {
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
		}
	)

	test.skip(
		'insertAttemptScoredEvents calls insertEvent with expected params (preview mode = true, isScoreSent = true)',
		done => {
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
		}
	)

	test.skip(
		'insertAttemptScoredEvents calls insertEvent with expected params (preview mode = false, isScoreSent = false)',
		done => {
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
		}
	)

	test.skip(
		'insertAttemptScoredEvents calls insertEvent with expected params (preview mode = false, isScoreSent = true)',
		done => {
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
		}
	)

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
})
