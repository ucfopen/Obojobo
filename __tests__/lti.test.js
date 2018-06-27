import lti from '../lti'
import { debug } from 'util'
import { TableName } from 'pg-promise'

jest.mock('../db')
jest.mock('uuid')
jest.mock('../logger')
jest.mock('../insert_event')

let moment = require('moment')
let db = require('../db')
let logger = oboRequire('logger')
let insertEvent = require('../insert_event')

let logId = 'DEADBEEF-0000-DEAD-BEEF-1234DEADBEEF'
let _DateToISOString

jest.mock('../config', () => {
	return {
		lti: {
			keys: {
				testkey: 'testsecret'
			}
		}
	}
})

jest.mock('ims-lti/src/extensions/outcomes', () => {
	let OutcomeService = function() {
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
let OutcomeService = require('ims-lti/src/extensions/outcomes').OutcomeService

let mockDate = () => {
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
let mockSendAssessScoreDBCalls = (
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
			preview: true
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
			preview: false
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
				gradebook_status: 'ok_gradebook_matches_assessment_score'
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
		let secret = lti.findSecretForKey('testkey')
		expect(secret).toBe('testsecret')
	})

	test('findSecretForKey should fail to find an unused key', () => {
		expect(lti.findSecretForKey('fakekey')).toBe(null)
	})

	test('isScoreValid ensures scores are valid', () => {
		let isScoreValid = lti.isScoreValid

		expect(isScoreValid(0)).toBe(true)
		expect(isScoreValid(0.1)).toBe(true)
		expect(isScoreValid(0.9)).toBe(true)
		expect(isScoreValid(1)).toBe(true)

		expect(isScoreValid(-1)).toBe(false)
		expect(isScoreValid(1.1)).toBe(false)
		expect(isScoreValid(null)).toBe(false)
		expect(isScoreValid(undefined)).toBe(false)
		expect(isScoreValid(true)).toBe(false)
		expect(isScoreValid(false)).toBe(false)
		expect(isScoreValid(NaN)).toBe(false)
		expect(isScoreValid('0')).toBe(false)
		expect(isScoreValid('1')).toBe(false)
		expect(isScoreValid('0.5')).toBe(false)
		expect(isScoreValid(Infinity)).toBe(false)
		expect(isScoreValid(-Infinity)).toBe(false)
	})

	test('isLaunchExpired checks if a launch is expired after 5 hours', () => {
		let isLaunchExpired = lti.isLaunchExpired

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

	test('getGradebookStatus returns the proper status', () => {
		let ggs = lti.getGradebookStatus

		// ARGUMENTS:
		// outcomeType = 'unknownOutcome' || 'noOutcome' || 'hasOutcome'
		// scoreType = 'nullScore || invalidScore || sameScore || differentScore'
		// replaceResultWasSentSuccessfully = T/F
		// isPreview = T/F
		//
		// RETURN:
		//	* error_newer_assessment_score_unsent
		//	* error_state_unknown
		//	* error_invalid
		//	* ok_null_score_not_sent
		//	* ok_gradebook_matches_assessment_score
		//	* ok_no_outcome_service
		//  * ok_preview_mode

		let unsent = 'error_newer_assessment_score_unsent'
		let unk = 'error_state_unknown'
		let invalid = 'error_invalid'
		let okNull = 'ok_null_score_not_sent'
		let match = 'ok_gradebook_matches_assessment_score'
		let noOutcome = 'ok_no_outcome_service'
		let okPreview = 'ok_preview_mode'

		expect(ggs('unknownOutcome', 'nullScore', false, false)).toBe(okNull)
		expect(ggs('unknownOutcome', 'invalidScore', false, false)).toBe(unk)
		expect(ggs('unknownOutcome', 'sameScore', false, false)).toBe(match)
		expect(ggs('unknownOutcome', 'differentScore', false, false)).toBe(unk)

		expect(ggs('unknownOutcome', 'nullScore', true, false)).toBe(invalid)
		expect(ggs('unknownOutcome', 'invalidScore', true, false)).toBe(invalid)
		expect(ggs('unknownOutcome', 'sameScore', true, false)).toBe(invalid)
		expect(ggs('unknownOutcome', 'differentScore', true, false)).toBe(invalid)

		//

		expect(ggs('noOutcome', 'nullScore', false, false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'invalidScore', false, false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'sameScore', false, false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'differentScore', false, false)).toBe(noOutcome)

		expect(ggs('noOutcome', 'nullScore', true, false)).toBe(invalid)
		expect(ggs('noOutcome', 'invalidScore', true, false)).toBe(invalid)
		expect(ggs('noOutcome', 'sameScore', true, false)).toBe(invalid)
		expect(ggs('noOutcome', 'differentScore', true, false)).toBe(invalid)

		//

		expect(ggs('hasOutcome', 'nullScore', false, false)).toBe(okNull)
		expect(ggs('hasOutcome', 'invalidScore', false, false)).toBe(unk)
		expect(ggs('hasOutcome', 'sameScore', false, false)).toBe(match)
		expect(ggs('hasOutcome', 'differentScore', false, false)).toBe(unsent)

		expect(ggs('hasOutcome', 'nullScore', true, false)).toBe(invalid)
		expect(ggs('hasOutcome', 'invalidScore', true, false)).toBe(invalid)
		expect(ggs('hasOutcome', 'sameScore', true, false)).toBe(match)
		expect(ggs('hasOutcome', 'differentScore', true, false)).toBe(match)

		//

		expect(ggs('unknownOutcome', 'nullScore', false, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'invalidScore', false, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'sameScore', false, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'differentScore', false, true)).toBe(okPreview)

		expect(ggs('unknownOutcome', 'nullScore', true, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'invalidScore', true, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'sameScore', true, true)).toBe(okPreview)
		expect(ggs('unknownOutcome', 'differentScore', true, true)).toBe(okPreview)

		//

		expect(ggs('noOutcome', 'nullScore', false, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'invalidScore', false, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'sameScore', false, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'differentScore', false, true)).toBe(okPreview)

		expect(ggs('noOutcome', 'nullScore', true, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'invalidScore', true, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'sameScore', true, true)).toBe(okPreview)
		expect(ggs('noOutcome', 'differentScore', true, true)).toBe(okPreview)

		//

		expect(ggs('hasOutcome', 'nullScore', false, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'invalidScore', false, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'sameScore', false, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'differentScore', false, true)).toBe(okPreview)

		expect(ggs('hasOutcome', 'nullScore', true, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'invalidScore', true, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'sameScore', true, true)).toBe(okPreview)
		expect(ggs('hasOutcome', 'differentScore', true, true)).toBe(okPreview)
	})

	test('getLatestHighestAssessmentScoreRecord returns an object with expected properties', done => {
		let getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockResolvedValueOnce({
			id: 'id',
			user_id: 'user_id',
			draft_id: 'draft_id',
			draft_content_id: 'content_id',
			assessment_id: 'assessment_id',
			attempt_id: 'attempt_id',
			score: 'score',
			preview: 'preview'
		})

		getLatestHighestAssessmentScoreRecord('user_id', 'draft_id', 'assessment_id').then(result => {
			expect(result).toEqual({
				id: 'id',
				userId: 'user_id',
				draftId: 'draft_id',
				contentId: 'content_id',
				assessmentId: 'assessment_id',
				attemptId: 'attempt_id',
				score: 'score',
				preview: 'preview',
				error: null
			})

			done()
		})
	})

	test('getLatestHighestAssessmentScoreRecord returns error if nothing returned', done => {
		let getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockResolvedValueOnce(null)
		getLatestHighestAssessmentScoreRecord('user_id', 'draft_id', 'assessment_id')
			.then(result => {
				expect(result.error.message).toBe('No assessment score found')
				done()
			})
			.catch(e => {
				expect('this to never').toBe('called')
				done()
			})
	})

	test('getLatestSuccessfulLTIAssessmentScoreRecord returns a record with expected values', done => {
		db.oneOrNone.mockResolvedValueOnce({ properties: 'properties' })

		lti.getLatestSuccessfulLTIAssessmentScoreRecord(123).then(result => {
			expect(result).toEqual({
				properties: 'properties'
			})

			done()
		})
	})

	test('send same assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('send different assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('send first assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('send null assessment score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('send assessment score with no outcome results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('replaceResult fail for same score results in "error_replace_result_failed" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('replaceResult fail for different score results in "error_replace_result_failed" and "error_newer_assessment_score_unsent"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('missing key for newer assessment score results in "error_no_secret_for_key" and "error_newer_assessment_score_unsent"', done => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true, 'nokey')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('missing key for same assessment score results in "error_no_secret_for_key" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true, 'nokey')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		// expect(logger.error.mock.calls).toBe(1)

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	//@TODO
	test('no assessment score results in "error_no_assessment_score_found" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls('missing', 1, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			// expect(logger.error.mock.calls).toBe(1)
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual([
				'LTI no assessment score found, unable to proceed!',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI gradebook status is "error_state_unknown"',
				logId
			])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI store "error_no_assessment_score_found" success - id:"new-lti-assessment-score-id"',
				logId
			])
			expect(logger.info.mock.calls[3]).toEqual(['LTI complete', logId])

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

			done()
		})
	})

	test('no launch for different score results in "error_no_launch_found" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, 'missing')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('no launch for same score results in "error_no_launch_found" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, 'missing')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('no launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
		mockSendAssessScoreDBCalls(null, 1, moment().toISOString(), false, 'missing')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('expired launch for same score results in "error_launch_expired" and "ok_gradebook_matches_assessment_score"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('expired launch for different score results in "error_launch_expired" and "error_newer_assessment_score_unsent"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('expired launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('expired launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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
				contentId: 'content-id'
			})

			done()
		})
	})

	test('expired launch for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('invalid score results in "error_score_is_invalid" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('invalid score for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, false)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', done => {
		mockSendAssessScoreDBCalls(1, 1, moment().toISOString(), false, true, 'testkey', true, true)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending preview score for user:"user-id" on draft:"draft-id"',
				logId
			])
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
				contentId: 'content-id'
			})
			done()
		})
	})

	test('no launch for preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
			expect(logger.info.mock.calls[0]).toEqual([
				'LTI begin sendHighestAssessmentScore for userId:"user-id", draftId:"draft-id", assessmentId:"assessment-id"',
				logId
			])
			expect(logger.info.mock.calls[1]).toEqual([
				'LTI found assessment score. Details: user:"user-id", draft:"draft-id", score:"1", assessmentScoreId:"assessment-score-id", attemptId:"attempt-id", preview:"true"',
				logId
			])
			expect(logger.error.mock.calls[0]).toEqual(['LTI error attempting to retrieve launch', logId])
			expect(logger.info.mock.calls[2]).toEqual([
				'LTI not sending preview score for user:"user-id" on draft:"draft-id"',
				logId
			])
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
				contentId: 'content-id'
			})
			done()
		})
	})

	test('null score in preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending preview score for user:"user-id" on draft:"draft-id"',
				logId
			])
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
				contentId: 'content-id'
			})
			done()
		})
	})

	test('invalid score in preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending preview score for user:"user-id" on draft:"draft-id"',
				logId
			])
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
				contentId: 'content-id'
			})
			done()
		})
	})

	test('expired launch for preview mode results in "not_attempted_preview_mode" and "ok_preview_mode"', done => {
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
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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
			expect(logger.info.mock.calls[3]).toEqual([
				'LTI not sending preview score for user:"user-id" on draft:"draft-id"',
				logId
			])
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
				contentId: 'content-id'
			})
			done()
		})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraft returns expected values', done => {
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

		lti.getLTIStatesByAssessmentIdForUserAndDraft('user-id', 'draft-id').then(result => {
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

			done()
		})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraft searches on assessment', done => {
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

		lti
			.getLTIStatesByAssessmentIdForUserAndDraft('user-id', 'draft-id', 'assessment-id')
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

				done()
			})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraft returns empty object when nothing returned from database', done => {
		db.manyOrNone.mockResolvedValueOnce(null)

		lti.getLTIStatesByAssessmentIdForUserAndDraft('user-id', 'draft-id').then(result => {
			expect(result).toEqual({})

			done()
		})
	})

	test('getOutcomeServiceForLaunch returns error if unexpected error occurs', () => {
		// reqVars should be a plain js object but by making it an instance of
		// this class below I can cause an error to be thrown when getOutcomeServiceForLaunch
		// tries to get lis_outcome_service_url. I just need to get some error to be
		// thrown in getOutcomeServiceForLaunch so that it can be caught.

		let rtn = lti.getOutcomeServiceForLaunch({
			key: 'testkey',
			reqVars: new MockedBadReqVars()
		})

		expect(rtn.error.message).toBe('Some Unexpected Error')
	})

	test('sendReplaceResultRequest returns false when OutcomeService returns error, logs error', done => {
		OutcomeService.__setNextSendReplaceResultError(new Error('Internal Outcome Service Error'))
		// OutcomeService.__setNextSendReplaceResultReturn('rv')

		let os = new OutcomeService()
		os.service_url = 'service-url'

		lti.sendReplaceResultRequest(os, 1).then(result => {
			expect(result).toBe(false)
			expect(logger.info).toHaveBeenCalledWith('LTI sendReplaceResult to "service-url" with "1"')
			expect(logger.info).toHaveBeenCalledWith(
				'LTI sendReplaceResult threw error: "Error: Internal Outcome Service Error"'
			)
			done()
		})
	})

	test('insertReplaceResultEvent calls insertEvent', done => {
		insertEvent.mockResolvedValueOnce('inserted')

		lti.insertReplaceResultEvent('mockUserId', 'mockDraftId', {}, {}, 'mockLTIResult').then(() => {
			expect(insertEvent).toHaveBeenCalled()
			done()
		})
	})

	test('insertReplaceResultEvent catches error', done => {
		insertEvent.mockRejectedValueOnce(new Error('mock Error'))

		lti.insertReplaceResultEvent('mockUserId', 'mockDraftId', {}, {}, 'mockLTIResult').then(() => {
			expect(logger.error).toHaveBeenCalledWith('There was an error inserting the lti event')
			done()
		})
	})

	test('logAndGetStatusForError logs unexpected error', () => {
		// All other errors are tested through other methods

		let result = lti.logAndGetStatusForError(new Error('Mock Error'), {}, logId)
		expect(result).toEqual({
			status: 'error_unexpected',
			statusDetails: { message: 'Mock Error' }
		})
	})

	test('sendHighestAssessmentScore fails and logs as expected', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true, 'testkey', false)
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})

	test('unexpected error works as expected', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, 'error')
		mockDate()
		let mockDraft = {
			draftId: 'draft-id',
			contentId: 'content-id'
		}

		lti.sendHighestAssessmentScore('user-id', mockDraft, 'assessment-id').then(result => {
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

			done()
		})
	})
})
