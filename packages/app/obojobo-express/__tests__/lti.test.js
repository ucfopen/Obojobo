import lti from '../server/lti'

jest.mock('../server/db')
jest.mock('uuid')
jest.mock('../server/logger')
jest.mock('../server/insert_event')

const moment = require('moment')
const db = oboRequire('server/db')
const logger = oboRequire('server/logger')
const insertEvent = oboRequire('server/insert_event')

const logId = 'DEADBEEF-0000-DEAD-BEEF-1234DEADBEEF'
let _DateToISOString

jest.mock('../server/config', () => {
	return {
		lti: {
			keys: {
				testkey: 'testsecret'
			}
		}
	}
})

jest.mock('ims-lti/src/extensions/outcomes', () => {
	const OutcomeService = function() {
		this.service_url = 'lis_outcome_service_url'
	}
	OutcomeService.__setNextSendReplaceResultReturn = function(rtnValue) {
		OutcomeService.__send_replace_result_value = rtnValue
	}
	OutcomeService.__setNextSendReplaceResultError = function(e) {
		OutcomeService.__send_replace_result_error = e
	}
	OutcomeService.prototype.send_replace_result = function(score, cb) {
		if (OutcomeService.__send_replace_result_error) {
			cb(OutcomeService.__send_replace_result_error, null)
			delete OutcomeService.__send_replace_result_error
		} else {
			cb(null, OutcomeService.__send_replace_result_value)
			delete OutcomeService.__send_replace_result_value
		}
	}

	return {
		OutcomeService
	}
})
const OutcomeService = require('ims-lti/src/extensions/outcomes').OutcomeService

const mockDate = () => {
	global.Date.prototype.toISOString = () => 'MOCKED-ISO-DATE-STRING'
}

class MockedBadReqVars {
	get lis_outcome_service_url() {
		throw new Error('Some Unexpected Error')
	}

	get lis_result_sourcedid() {
		return 'lis_result_sourcedid'
	}
}

// Set assessmentScore to null to specify no assessment score record
const mockSendAssessScoreDBCalls = (
	assessmentScore, // Use 'missing' to indicate no assessment score record
	ltiPrevRecordScoreSent,
	creationDate,
	sendReplaceResultSuccessful,
	ltiHasOutcome, // Use 'missing' to indicate no launch, 'error' to throw an error
	ltiKey = 'testkey',
	insertLTIAssessmentScoreSucceeds = true,
	previewMode = false
) => {
	// mock get assessment_score
	if (assessmentScore === 'missing') {
		db.oneOrNone.mockResolvedValueOnce(null)
	} else if (previewMode === true) {
		db.oneOrNone.mockResolvedValueOnce({
			id: 'assessment-score-id',
			user_id: 'user-id',
			draft_id: 'draft-id',
			draft_content_id: 'content-id',
			assessment_id: 'assessment-id',
			attempt_id: 'attempt-id',
			score: assessmentScore,
			score_details: {
				status: 'passed',
				rewardTotal: 0,
				attemptScore: assessmentScore,
				rewardedMods: [],
				attemptNumber: 1,
				assessmentScore: assessmentScore,
				assessmentModdedScore: assessmentScore
			},
			is_preview: true
		})
	} else {
		db.oneOrNone.mockResolvedValueOnce({
			id: 'assessment-score-id',
			user_id: 'user-id',
			draft_id: 'draft-id',
			draft_content_id: 'content-id',
			assessment_id: 'assessment-id',
			attempt_id: 'attempt-id',
			score: assessmentScore,
			score_details: {
				status: 'passed',
				rewardTotal: 0,
				attemptScore: assessmentScore,
				rewardedMods: [],
				attemptNumber: 1,
				assessmentScore: assessmentScore,
				assessmentModdedScore: assessmentScore
			},
			is_preview: false
		})
	}

	if (assessmentScore !== 'missing') {
		// mock getLatestSuccessfulLTIAssessmentScoreRecord
		if (ltiPrevRecordScoreSent === null) {
			db.oneOrNone.mockResolvedValueOnce(null)
		} else {
			db.oneOrNone.mockResolvedValueOnce({
				id: 'lti-assessment-score-id',
				created_at: creationDate,
				assessment_score_id: 'assessment-score-id',
				launch_id: 'launch-id',
				score_sent: ltiPrevRecordScoreSent,
				status_details: null,
				log_id: logId,
				status: 'success',
				gradebook_status: 'ok_gradebook_matches_assessment_score',
				is_preview: false
			})
		}

		// mock tryRetrieveLtiLaunch:
		if (ltiHasOutcome === 'missing') {
			db.oneOrNone.mockResolvedValueOnce(false)
		} else if (ltiHasOutcome === 'error') {
			db.oneOrNone.mockResolvedValueOnce({
				id: 'launch-id',
				data: new MockedBadReqVars(),
				lti_key: ltiKey,
				created_at: creationDate
			})
		} else {
			db.oneOrNone.mockResolvedValueOnce({
				id: 'launch-id',
				data: {
					lis_outcome_service_url: ltiHasOutcome ? 'lis_outcome_service_url' : null,
					lis_result_sourcedid: 'lis_result_sourcedid'
				},
				lti_key: ltiKey,
				created_at: creationDate
			})
		}
	}

	// mock insertLTIAssessmentScore:
	if (insertLTIAssessmentScoreSucceeds) {
		db.one.mockResolvedValueOnce({ id: 'new-lti-assessment-score-id' })
	} else {
		db.one.mockReturnValueOnce(
			new Promise(() => {
				throw new Error('insertLTIAssessmentScore failed')
			})
		)
	}

	// mock insertEvent
	db.one.mockResolvedValueOnce(true)

	OutcomeService.__setNextSendReplaceResultReturn(sendReplaceResultSuccessful)
}

describe('lti', () => {
	beforeAll(() => {
		jest.mock('ims-lti/src/extensions/outcomes')
	})

	afterAll(() => {})

	beforeEach(() => {
		jest.resetAllMocks()
		_DateToISOString = global.Date.prototype.toISOString
	})

	afterEach(() => {
		global.Date.prototype.toISOString = _DateToISOString
	})

	test('findSecretForKey should find the appropriate secret for a given key', () => {
		const secret = lti.findSecretForKey('testkey')
		expect(secret).toBe('testsecret')
	})

	test('findSecretForKey should fail to find an unused key', () => {
		expect(lti.findSecretForKey('fakekey')).toBe(null)
	})

	test.each([
		[0, true],
		[0.1, true],
		[0.9, true],
		[1, true],
		[-1, false],
		[1.1, false],
		[null, false],
		[undefined, false], //eslint-disable-line no-undefined
		[true, false],
		[false, false],
		[NaN, false],
		['0', false],
		['1', false],
		['0.5', false],
		[Infinity, false],
		[-Infinity, false]
	])('isScoreValid(%s) returns %s', (score, expected) => {
		expect(lti.isScoreValid(score)).toBe(expected)
	})

	test('isLaunchExpired checks if a launch is expired after 5 hours', () => {
		const isLaunchExpired = lti.isLaunchExpired

		expect(isLaunchExpired(moment().toISOString())).toBe(false)
		expect(
			isLaunchExpired(
				moment()
					.subtract(1, 'minute')
					.toISOString()
			)
		).toBe(false)
		expect(
			isLaunchExpired(
				moment()
					.subtract(295, 'minute')
					.toISOString()
			)
		).toBe(false)
		expect(
			isLaunchExpired(
				moment()
					.subtract(301, 'minute')
					.toISOString()
			)
		).toBe(true)
	})

	const unsent = 'error_newer_assessment_score_unsent'
	const unk = 'error_state_unknown'
	const invalid = 'error_invalid'
	const okNull = 'ok_null_score_not_sent'
	const match = 'ok_gradebook_matches_assessment_score'
	const noOutcome = 'ok_no_outcome_service'
	const okPreview = 'ok_preview_mode'

	test.each([
		['unknownOutcome', 'nullScore', false, false, okNull],
		['unknownOutcome', 'invalidScore', false, false, unk],
		['unknownOutcome', 'sameScore', false, false, match],
		['unknownOutcome', 'differentScore', false, false, unk],
		['unknownOutcome', 'nullScore', true, false, invalid],
		['unknownOutcome', 'invalidScore', true, false, invalid],
		['unknownOutcome', 'sameScore', true, false, invalid],
		['unknownOutcome', 'differentScore', true, false, invalid],
		['noOutcome', 'nullScore', false, false, noOutcome],
		['noOutcome', 'invalidScore', false, false, noOutcome],
		['noOutcome', 'sameScore', false, false, noOutcome],
		['noOutcome', 'differentScore', false, false, noOutcome],
		['noOutcome', 'nullScore', true, false, invalid],
		['noOutcome', 'invalidScore', true, false, invalid],
		['noOutcome', 'sameScore', true, false, invalid],
		['noOutcome', 'differentScore', true, false, invalid],
		['hasOutcome', 'nullScore', false, false, okNull],
		['hasOutcome', 'invalidScore', false, false, unk],
		['hasOutcome', 'sameScore', false, false, match],
		['hasOutcome', 'differentScore', false, false, unsent],
		['hasOutcome', 'nullScore', true, false, invalid],
		['hasOutcome', 'invalidScore', true, false, invalid],
		['hasOutcome', 'sameScore', true, false, match],
		['hasOutcome', 'differentScore', true, false, match],
		['unknownOutcome', 'nullScore', false, true, okPreview],
		['unknownOutcome', 'invalidScore', false, true, okPreview],
		['unknownOutcome', 'sameScore', false, true, okPreview],
		['unknownOutcome', 'differentScore', false, true, okPreview],
		['unknownOutcome', 'nullScore', true, true, okPreview],
		['unknownOutcome', 'invalidScore', true, true, okPreview],
		['unknownOutcome', 'sameScore', true, true, okPreview],
		['unknownOutcome', 'differentScore', true, true, okPreview],
		['noOutcome', 'nullScore', false, true, okPreview],
		['noOutcome', 'invalidScore', false, true, okPreview],
		['noOutcome', 'sameScore', false, true, okPreview],
		['noOutcome', 'differentScore', false, true, okPreview],
		['noOutcome', 'nullScore', true, true, okPreview],
		['noOutcome', 'invalidScore', true, true, okPreview],
		['noOutcome', 'sameScore', true, true, okPreview],
		['noOutcome', 'differentScore', true, true, okPreview],
		['hasOutcome', 'nullScore', false, true, okPreview],
		['hasOutcome', 'invalidScore', false, true, okPreview],
		['hasOutcome', 'sameScore', false, true, okPreview],
		['hasOutcome', 'differentScore', false, true, okPreview],
		['hasOutcome', 'nullScore', true, true, okPreview],
		['hasOutcome', 'invalidScore', true, true, okPreview],
		['hasOutcome', 'sameScore', true, true, okPreview],
		['hasOutcome', 'differentScore', true, true, okPreview]
	])(
		'getGradebookStatus(%s, %s, %s, %s) returns %s',
		(outcomeType, scoreType, replaceResultWasSentSuccessfully, isPreview, expected) => {
			expect(
				lti.getGradebookStatus(outcomeType, scoreType, replaceResultWasSentSuccessfully, isPreview)
			).toBe(expected)
		}
	)

	test('getLatestHighestAssessmentScoreRecord returns an object with expected properties', () => {
		const getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockResolvedValueOnce({
			id: 'id',
			user_id: 'user_id',
			draft_id: 'draft_id',
			draft_content_id: 'content_id',
			assessment_id: 'assessment_id',
			attempt_id: 'attempt_id',
			score: 'score',
			is_preview: 'preview',
			score_details: 'details'
		})

		return getLatestHighestAssessmentScoreRecord(
			'user_id',
			'draft_id',
			'assessment_id',
			false
		).then(result => {
			expect(result).toEqual({
				id: 'id',
				userId: 'user_id',
				draftId: 'draft_id',
				contentId: 'content_id',
				assessmentId: 'assessment_id',
				attemptId: 'attempt_id',
				score: 'score',
				isPreview: 'preview',
				error: null,
				scoreDetails: 'details'
			})
		})
	})

	test('getLatestHighestAssessmentScoreRecord returns error if nothing returned', () => {
		const getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockResolvedValueOnce(null)
		return getLatestHighestAssessmentScoreRecord(
			'user_id',
			'draft_id',
			'assessment_id',
			false
		).then(result => {
			expect(result.error.message).toBe('No assessment score found')
		})
	})

	test('getLatestHighestAssessmentScoreRecord returns error if an error occurs', () => {
		const getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockRejectedValueOnce('an error occured')
		return getLatestHighestAssessmentScoreRecord().then(result => {
			expect(result.error).toBe('an error occured')
		})
	})

	test('getLatestSuccessfulLTIAssessmentScoreRecord returns a record with expected values', () => {
		db.oneOrNone.mockResolvedValueOnce({ properties: 'properties' })

		return lti.getLatestSuccessfulLTIAssessmentScoreRecord(123).then(result => {
			expect(result).toEqual({
				properties: 'properties'
			})
		})
	})

	test('send same assessment score results in "success" and "ok_gradebook_matches_assessment"', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', true, logId])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[7]).toEqual([
				'LTI store "success" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[8]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'success',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('send different assessment score results in "success" and "ok_gradebook_matches_assessment"', () => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', true, logId])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[7]).toEqual([
				'LTI store "success" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[8]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'success',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('send first assessment score results in "success" and "ok_gradebook_matches_assessment"', () => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', true, logId])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[7]).toEqual([
				'LTI store "success" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[8]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'success',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('send null assessment score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', () => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending null score for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_null_score_not_sent"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_score_is_null" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_score_is_null',
						statusDetails: null,
						gradebookStatus: 'ok_null_score_not_sent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('send assessment score with no outcome results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', () => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending null score for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_null_score_not_sent"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_score_is_null" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_score_is_null',
						statusDetails: null,
						gradebookStatus: 'ok_null_score_not_sent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('replaceResult fail for same score results in "error_replace_result_failed" and "ok_gradebook_matches_assessment_score"', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', false, logId])
			expect(logger.error.mock.calls[0]).toEqual([
				'LTI replaceResult failed for user:"user-id" on draft:"draft-id"!',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[7]).toEqual([
				'LTI store "error_replace_result_failed" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[8]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'error_replace_result_failed',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'error_replace_result_failed',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('replaceResult fail for different score results in "error_replace_result_failed" and "error_newer_assessment_score_unsent"', () => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', false, logId])
			expect(logger.error.mock.calls[0]).toEqual([
				'LTI replaceResult failed for user:"user-id" on draft:"draft-id"!',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "error_newer_assessment_score_unsent"',
				logId
			])
			expect(logger.info.mock.calls[7]).toEqual([
				'LTI store "error_replace_result_failed" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[8]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'error_replace_result_failed',
						statusDetails: null,
						gradebookStatus: 'error_newer_assessment_score_unsent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'error_replace_result_failed',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('missing key for newer assessment score results in "error_no_secret_for_key" and "error_newer_assessment_score_unsent"', () => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true, 'nokey')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI ERROR: No secret found for key:"nokey"'])
			expect(logger.error.mock.calls[1]).toEqual(['LTI No secret found for key:"nokey"!', logId])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "error_newer_assessment_score_unsent"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_no_secret_for_key" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'nokey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_no_secret_for_key',
						statusDetails: null,
						gradebookStatus: 'error_newer_assessment_score_unsent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_no_secret_for_key',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('missing key for same assessment score results in "error_no_secret_for_key" and "ok_gradebook_matches_assessment_score"', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true, 'nokey')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		// expect(logger.error.mock.calls).toBe(1)

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI ERROR: No secret found for key:"nokey"'])
			expect(logger.error.mock.calls[1]).toEqual(['LTI No secret found for key:"nokey"!', logId])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_no_secret_for_key" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'nokey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_no_secret_for_key',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_no_secret_for_key',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('no assessment score results in "error_no_assessment_score_found" and "error_state_unknown"', () => {
		mockSendAssessScoreDBCalls('missing', 1, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info).toHaveBeenCalledWith(
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			)

			expect(logger.error).toHaveBeenCalledWith(
				'LTI no assessment score found, unable to proceed!',
				logId
			)
			expect(logger.info).toHaveBeenCalledWith(
				'LTI gradebook status is "error_state_unknown"',
				logId
			)
			expect(logger.info).toHaveBeenCalledWith(
				'LTI store "error_no_assessment_score_found" success - id:"new-lti-assessment-score-id"',
				logId
			)
			expect(logger.info).toHaveBeenCalledWith('LTI complete', logId)

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: null,
					launchKey: null,
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: null
					},
					result: {
						launchId: null,
						scoreSent: null,
						status: 'error_no_assessment_score_found',
						statusDetails: null,
						gradebookStatus: 'error_state_unknown',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_assessment_score_found',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('no launch for different score results in "error_no_launch_found" and "error_state_unknown"', () => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, 'missing')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI error attempting to retrieve launch', logId])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI gradebook status is "error_state_unknown"',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI store "error_no_launch_found" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: null,
					launchKey: null,
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: null
					},
					result: {
						launchId: null,
						scoreSent: null,
						status: 'error_no_launch_found',
						statusDetails: null,
						gradebookStatus: 'error_state_unknown',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_launch_found',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('no launch for same score results in "error_no_launch_found" and "ok_gradebook_matches_assessment_score"', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, 'missing')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI error attempting to retrieve launch', logId])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI store "error_no_launch_found" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: null,
					launchKey: null,
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: null
					},
					result: {
						launchId: null,
						scoreSent: null,
						status: 'error_no_launch_found',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_launch_found',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('no launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', () => {
		mockSendAssessScoreDBCalls(null, 1, moment().toISOString(), false, 'missing')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI error attempting to retrieve launch', logId])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI not sending null score for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "ok_null_score_not_sent"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "not_attempted_score_is_null" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: null,
					launchKey: null,
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: null
					},
					result: {
						launchId: null,
						scoreSent: null,
						status: 'not_attempted_score_is_null',
						statusDetails: null,
						gradebookStatus: 'ok_null_score_not_sent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('expired launch for same score results in "error_launch_expired" and "ok_gradebook_matches_assessment_score"', () => {
		mockSendAssessScoreDBCalls(
			100,
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_launch_expired" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_launch_expired',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_launch_expired',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('expired launch for different score results in "error_launch_expired" and "error_newer_assessment_score_unsent"', () => {
		mockSendAssessScoreDBCalls(
			100,
			0.5,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "error_newer_assessment_score_unsent"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_launch_expired" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_launch_expired',
						statusDetails: null,
						gradebookStatus: 'error_newer_assessment_score_unsent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_launch_expired',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('expired launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', () => {
		mockSendAssessScoreDBCalls(
			null,
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending null score for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_null_score_not_sent"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_score_is_null" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_score_is_null',
						statusDetails: null,
						gradebookStatus: 'ok_null_score_not_sent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('expired launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', () => {
		mockSendAssessScoreDBCalls(
			null,
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending null score for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_null_score_not_sent"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_score_is_null" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_score_is_null',
						statusDetails: null,
						gradebookStatus: 'ok_null_score_not_sent',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('expired launch for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', () => {
		mockSendAssessScoreDBCalls(
			100,
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			false
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI No outcome service for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_no_outcome_service"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_no_outcome_service_for_launch" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_no_outcome_service_for_launch',
						statusDetails: null,
						gradebookStatus: 'ok_no_outcome_service',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_no_outcome_service_for_launch',
				statusDetails: null,
				gradebookStatus: 'ok_no_outcome_service',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('invalid score results in "error_score_is_invalid" and "error_state_unknown"', () => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"doggo", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual([
				'LTI not sending invalid score "NaN" for user:"user-id" on draft:"draft-id"!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "error_state_unknown"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_score_is_invalid" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_score_is_invalid',
						statusDetails: null,
						gradebookStatus: 'error_state_unknown',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_score_is_invalid',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('invalid score for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', () => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, false)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"doggo", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI No outcome service for user:"user-id" on draft:"draft-id"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_no_outcome_service"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_no_outcome_service_for_launch" success - id:"new-lti-assessment-score-id"',
				logId
			])
			// expect(logger.error.mock.calls).toEqual(['LTI complete', logId])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_no_outcome_service_for_launch',
						statusDetails: null,
						gradebookStatus: 'ok_no_outcome_service',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_no_outcome_service_for_launch',
				statusDetails: null,
				gradebookStatus: 'ok_no_outcome_service',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})

	test('preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', () => {
		mockSendAssessScoreDBCalls(1, 1, moment().toISOString(), false, true, 'testkey', true, true)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id', true).then(() => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"1", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual(['LTI not sending preview score', logId])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_preview_mode"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_preview_mode" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_preview_mode',
						statusDetails: null,
						gradebookStatus: 'ok_preview_mode',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('no launch for preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', () => {
		mockSendAssessScoreDBCalls(
			1,
			1,
			moment().toISOString(),
			false,
			'missing',
			'testkey',
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id', true).then(() => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"1", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI error attempting to retrieve launch', logId])
			expect(logger.info.mock.calls[2]).toEqual(['LTI not sending preview score', logId])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "ok_preview_mode"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "not_attempted_preview_mode" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: null,
					launchKey: null,
					body: {
						lis_outcome_service_url: null,
						lis_result_sourcedid: null
					},
					result: {
						launchId: null,
						scoreSent: null,
						status: 'not_attempted_preview_mode',
						statusDetails: null,
						gradebookStatus: 'ok_preview_mode',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('null score in preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', () => {
		mockSendAssessScoreDBCalls(
			null,
			null,
			moment().toISOString(),
			false,
			true,
			'testkey',
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id', true).then(() => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"null", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual(['LTI not sending preview score', logId])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_preview_mode"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_preview_mode" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_preview_mode',
						statusDetails: null,
						gradebookStatus: 'ok_preview_mode',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('invalid score in preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', () => {
		mockSendAssessScoreDBCalls(
			'doggo',
			1,
			moment().toISOString(),
			false,
			true,
			'testkey',
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id', true).then(() => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"doggo", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual(['LTI not sending preview score', logId])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_preview_mode"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_preview_mode" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_preview_mode',
						statusDetails: null,
						gradebookStatus: 'ok_preview_mode',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('expired launch for preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', () => {
		mockSendAssessScoreDBCalls(
			1,
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			true,
			'testkey',
			true,
			true
		)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id', true).then(() => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"1", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual(['LTI not sending preview score', logId])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI gradebook status is "ok_preview_mode"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual([
				'LTI store "not_attempted_preview_mode" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'not_attempted_preview_mode',
						statusDetails: null,
						gradebookStatus: 'ok_preview_mode',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})
		})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId returns expected values', () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				assessment_id: 'assessmentid',
				assessment_score_id: 'assessment-score-id',
				score_sent: 'score-sent',
				lti_sent_date: 'lti-sent-date',
				status: 'status',
				gradebook_status: 'gradebook-status',
				status_details: 'status-details'
			}
		])

		return lti
			.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId('user-id', 'draft-id')
			.then(result => {
				expect(result).toEqual({
					assessmentid: {
						assessmentId: 'assessmentid',
						assessmentScoreId: 'assessment-score-id',
						scoreSent: 'score-sent',
						sentDate: 'lti-sent-date',
						status: 'status',
						gradebookStatus: 'gradebook-status',
						statusDetails: 'status-details'
					}
				})
			})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId searches on assessment', () => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				assessment_id: 'assessment-id',
				assessment_score_id: 'assessment-score-id',
				score_sent: 'score-sent',
				lti_sent_date: 'lti-sent-date',
				status: 'status',
				gradebook_status: 'gradebook-status',
				status_details: 'status-details'
			}
		])

		return lti
			.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId(
				'user-id',
				'draft-id',
				'resource-link-id',
				'assessment-id',
				false
			)
			.then(result => {
				expect(result).toEqual({
					'assessment-id': {
						assessmentId: 'assessment-id',
						assessmentScoreId: 'assessment-score-id',
						scoreSent: 'score-sent',
						sentDate: 'lti-sent-date',
						status: 'status',
						gradebookStatus: 'gradebook-status',
						statusDetails: 'status-details'
					}
				})
			})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId returns empty object when nothing returned from database', () => {
		expect.hasAssertions()
		db.manyOrNone.mockResolvedValueOnce(null)

		return lti
			.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId('user-id', 'draft-id')
			.then(result => {
				expect(result).toEqual({})
			})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId throws errors', async () => {
		expect.hasAssertions()
		db.manyOrNone.mockRejectedValueOnce('mock-reject-error')
		try {
			await lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId('user-id', 'draft-id')
		} catch (e) {
			expect(logger.error).toHaveBeenCalledWith(
				'Error in getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId'
			)
			expect(logger.error).toHaveBeenCalledWith('mock-reject-error')
			expect(e).toBe('mock-reject-error')
		}
	})

	test('getOutcomeServiceForLaunch returns error if unexpected error occurs', () => {
		// reqVars should be a plain js object but by making it an instance of
		// this class below I can cause an error to be thrown when getOutcomeServiceForLaunch
		// tries to get lis_outcome_service_url. I just need to get some error to be
		// thrown in getOutcomeServiceForLaunch so that it can be caught.

		const rtn = lti.getOutcomeServiceForLaunch({
			key: 'testkey',
			reqVars: new MockedBadReqVars()
		})

		expect(rtn.error.message).toBe('Some Unexpected Error')
	})

	test('sendReplaceResultRequest returns false when OutcomeService returns error, logs error', () => {
		OutcomeService.__setNextSendReplaceResultError(new Error('Internal Outcome Service Error'))
		// OutcomeService.__setNextSendReplaceResultReturn('rv')

		const os = new OutcomeService()
		os.service_url = 'service-url'

		return lti.sendReplaceResultRequest(os, 1).then(result => {
			expect(result).toBe(false)
			expect(logger.info).toHaveBeenCalledWith('LTI sendReplaceResult to "service-url" with "1"')
			expect(logger.info).toHaveBeenCalledWith(
				'LTI sendReplaceResult threw error: "Error: Internal Outcome Service Error"'
			)
		})
	})

	test('insertReplaceResultEvent calls insertEvent', () => {
		insertEvent.mockResolvedValueOnce('inserted')

		lti.insertReplaceResultEvent('mockUserId', 'mockDraftId', {}, {}, 'mockLTIResult').then(() => {
			expect(insertEvent).toHaveBeenCalled()
		})
	})

	test('insertReplaceResultEvent catches error', () => {
		insertEvent.mockRejectedValueOnce(new Error('mock Error'))

		return lti
			.insertReplaceResultEvent('mockUserId', 'mockDraftId', {}, {}, 'mockLTIResult')
			.then(() => {
				expect(logger.error).toHaveBeenCalledWith(
					'There was an error inserting the lti event:',
					new Error('mock Error')
				)
			})
	})

	test('logAndGetStatusForError logs unexpected error', () => {
		// All other errors are tested through other methods

		const result = lti.logAndGetStatusForError(new Error('Mock Error'), {}, logId)
		expect(result).toEqual({
			status: 'error_unexpected',
			statusDetails: { message: 'Mock Error' }
		})
	})

	test('sendHighestAssessmentScore fails and logs as expected', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true, 'testkey', false)
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI attempting replaceResult of score:"1" for assessmentScoreId:"assessment-score-id" for user:"user-id", draft:"draft-id", sourcedid:"lis_result_sourcedid", url:"lis_outcome_service_url" using key:"testkey"',
				logId
			])
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI sendReplaceResult to "lis_outcome_service_url" with "1"'
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI replaceResult response', true, logId])
			expect(logger.info.mock.calls[6]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.error.mock.calls[0][0]).toBe('LTI bad error attempting to update database! :(')
			expect(logger.info.mock.calls[7]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: 'lis_outcome_service_url',
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: 1,
						status: 'success',
						statusDetails: null,
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'error',
						ltiAssessmentScoreId: null,
						outcomeServiceURL: 'lis_outcome_service_url'
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'error',
				ltiAssessmentScoreId: null,
				outcomeServiceURL: 'lis_outcome_service_url'
			})
		})
	})

	test('unexpected error works as expected', () => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, 'error')
		mockDate()
		const mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		return lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"100", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"false"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI launch with id:"launch-id" retrieved!',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI gradebook status is "ok_gradebook_matches_assessment_score"',
				logId
			])
			expect(logger.error.mock.calls[0][0]).toBe(
				'LTI bad error, was **unexpected** :( Stack trace:'
			)
			expect(logger.info.mock.calls[4]).toEqual([
				'LTI store "error_unexpected" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[5]).toEqual(['LTI complete', logId])

			expect(insertEvent).lastCalledWith({
				action: 'lti:replaceResult',
				actorTime: 'MOCKED-ISO-DATE-STRING',
				payload: {
					launchId: 'launch-id',
					launchKey: 'testkey',
					body: {
						lis_outcome_service_url: null, // Shouldn't be null but is due to MockedBadReqVars
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					result: {
						launchId: 'launch-id',
						scoreSent: null,
						status: 'error_unexpected',
						statusDetails: { message: 'Some Unexpected Error' },
						gradebookStatus: 'ok_gradebook_matches_assessment_score',
						dbStatus: 'recorded',
						ltiAssessmentScoreId: 'new-lti-assessment-score-id',
						outcomeServiceURL: null
					}
				},
				userId: 'user-id',
				ip: '',
				eventVersion: '2.0.0',
				metadata: {},
				draftId: 'draft-id',
				isPreview: false,
				contentId: 'content-id'
			})

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_unexpected',
				statusDetails: { message: 'Some Unexpected Error' },
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id',
				outcomeServiceURL: null
			})
		})
	})
})
