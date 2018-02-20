// let lti
// let mockLTIEvent = {
// 	id: 2,
// 	lti_key: 'testkey',
// 	data: {
// 		lis_outcome_service_url: 'http://test.test.test',
// 		lis_result_sourcedid: 'test-sourcedid'
// 	}
// }

import lti from '../lti'
import { debug } from 'util'
import { TableName } from 'pg-promise'

// let lti = require('lti')
let moment = require('moment')
let db = require('../db')
jest.mock('../db')
jest.mock('uuid')
// let db
jest.mock('../logger')
let logger = oboRequire('logger')
let logId = 'DEADBEEF-0000-DEAD-BEEF-1234DEADBEEF'
let _DateToISOString

// jest.mock('ims-lti/lib/extensions/outcomes', () => {
// 	return {
// 		OutcomeService: () => {
// 			throw new Error('OutcomeService Error!')
// 		}
// 	}
// })

mockVirtual('../insert_event', () => {
	// return jest.fn(() => Promise.resolve())
})
// let insertEvent = require('../insert_event')

// jest.mock('../insert_event', () => {
// 	let p = jest.fn()

// 	class P {
// 		then() {
// 			return new P()
// 		}

// 		catch() {
// 			return new P()
// 		}
// 	}

// 	p.mockImplementation(() => {
// 		return new P()
// 	})

// 	let f = jest.fn()
// 	// f.then = jest.fn()
// 	f.catch = jest.fn()

// 	return jest.fn(() => {
// 		return f
// 	})

// 	// return f

// 	// 	// return jest.fn(() => {
// 	// 	// 	return new P()
// 	// 	// })
//})

jest.mock('ims-lti/lib/extensions/outcomes', () => {
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
let OutcomeService = require('ims-lti/lib/extensions/outcomes').OutcomeService

let mockDate = () => {
	global.Date.prototype.toISOString = () => 'MOCKED-ISO-DATE-STRING'
}

// Set assessmentScore to null to specify no assessment score record
let mockSendAssessScoreDBCalls = (
	assessmentScore, // Use 'missing' to indicate no assessment score record
	ltiPrevRecordScoreSent,
	creationDate,
	sendReplaceResultSuccessful,
	ltiHasOutcome, // Use 'missing' to indicate no launch
	ltiKey = 'testkey'
) => {
	// mock get assessment_score
	if (assessmentScore === 'missing') {
		db.oneOrNone.mockReturnValueOnce(Promise.resolve(null))
	} else {
		db.oneOrNone.mockReturnValueOnce(
			Promise.resolve({
				id: 'assessment-score-id',
				user_id: 'user-id',
				draft_id: 'draft-id',
				assessment_id: 'assessment-id',
				attempt_id: 'attempt-id',
				score: assessmentScore,
				preview: false
			})
		)
	}

	if (assessmentScore !== 'missing') {
		// mock getLatestSuccessfulLTIAssessmentScoreRecord
		if (ltiPrevRecordScoreSent === null) {
			db.oneOrNone.mockReturnValueOnce(Promise.resolve(null))
		} else {
			db.oneOrNone.mockReturnValueOnce(
				Promise.resolve({
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
			)
		}

		// mock tryRetrieveLtiLaunch:
		if (ltiHasOutcome === 'missing') {
			db.oneOrNone.mockReturnValueOnce(Promise.resolve(false))
		} else {
			db.oneOrNone.mockReturnValueOnce(
				Promise.resolve({
					id: 'launch-id',
					data: {
						lis_outcome_service_url: ltiHasOutcome ? 'lis_outcome_service_url' : null,
						lis_result_sourcedid: 'lis_result_sourcedid'
					},
					lti_key: ltiKey,
					created_at: creationDate
				})
			)
		}
	}

	// mock insertLTIAssessmentScore:
	db.one.mockReturnValueOnce(Promise.resolve({ id: 'new-lti-assessment-score-id' }))

	// mock insertEvent
	db.one.mockReturnValueOnce(Promise.resolve(true))

	OutcomeService.__setNextSendReplaceResultReturn(sendReplaceResultSuccessful)
}

jest.mock('../config', () => {
	return {
		lti: {
			keys: {
				testkey: 'testsecret'
			}
		}
	}
})

describe('lti', () => {
	beforeAll(() => {
		global.console = { warn: jest.fn(), log: jest.fn(), error: jest.fn() }

		// db = require('../db')
		// jest.mock('../db')
		jest.mock('ims-lti/lib/extensions/outcomes')

		// let fs = require('fs')
		// fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"testkey":"testsecret"}}}')

		// lti = oboRequire('lti')
	})

	afterAll(() => {})

	beforeEach(() => {
		jest.resetAllMocks()
		_DateToISOString = global.Date.prototype.toISOString
	})

	afterEach(() => {
		// let outcomes = require('ims-lti/lib/extensions/outcomes')
		// outcomes.__resetCallbackForSend_replace_result()
		global.Date.prototype.toISOString = _DateToISOString
	})

	test('should find the appropriate secret for a given key', () => {
		let secret = lti.findSecretForKey('testkey')
		expect(secret).toBe('testsecret')
	})

	test('should fail to find an unused key', () => {
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
		//
		// RETURN:
		//	* error_newer_assessment_score_unsent
		//	* error_state_unknown
		//	* error_invalid
		//	* ok_null_score_not_sent
		//	* ok_gradebook_matches_assessment_score
		//	* ok_no_outcome_service

		let unsent = 'error_newer_assessment_score_unsent'
		let unk = 'error_state_unknown'
		let invalid = 'error_invalid'
		let okNull = 'ok_null_score_not_sent'
		let match = 'ok_gradebook_matches_assessment_score'
		let noOutcome = 'ok_no_outcome_service'

		expect(ggs('unknownOutcome', 'nullScore', false)).toBe(okNull)
		expect(ggs('unknownOutcome', 'invalidScore', false)).toBe(unk)
		expect(ggs('unknownOutcome', 'sameScore', false)).toBe(match)
		expect(ggs('unknownOutcome', 'differentScore', false)).toBe(unk)

		expect(ggs('unknownOutcome', 'nullScore', true)).toBe(invalid)
		expect(ggs('unknownOutcome', 'invalidScore', true)).toBe(invalid)
		expect(ggs('unknownOutcome', 'sameScore', true)).toBe(invalid)
		expect(ggs('unknownOutcome', 'differentScore', true)).toBe(invalid)

		//

		expect(ggs('noOutcome', 'nullScore', false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'invalidScore', false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'sameScore', false)).toBe(noOutcome)
		expect(ggs('noOutcome', 'differentScore', false)).toBe(noOutcome)

		expect(ggs('noOutcome', 'nullScore', true)).toBe(invalid)
		expect(ggs('noOutcome', 'invalidScore', true)).toBe(invalid)
		expect(ggs('noOutcome', 'sameScore', true)).toBe(invalid)
		expect(ggs('noOutcome', 'differentScore', true)).toBe(invalid)

		//

		expect(ggs('hasOutcome', 'nullScore', false)).toBe(okNull)
		expect(ggs('hasOutcome', 'invalidScore', false)).toBe(unk)
		expect(ggs('hasOutcome', 'sameScore', false)).toBe(match)
		expect(ggs('hasOutcome', 'differentScore', false)).toBe(unsent)

		expect(ggs('hasOutcome', 'nullScore', true)).toBe(invalid)
		expect(ggs('hasOutcome', 'invalidScore', true)).toBe(invalid)
		expect(ggs('hasOutcome', 'sameScore', true)).toBe(match)
		expect(ggs('hasOutcome', 'differentScore', true)).toBe(match)
	})

	test('getLatestHighestAssessmentScoreRecord returns an object with expected properties', done => {
		let getLatestHighestAssessmentScoreRecord = lti.getLatestHighestAssessmentScoreRecord

		db.oneOrNone.mockImplementationOnce((query, vars) => {
			return Promise.resolve({
				id: 'id',
				user_id: 'user_id',
				draft_id: 'draft_id',
				assessment_id: 'assessment_id',
				attempt_id: 'attempt_id',
				score: 'score',
				preview: 'preview'
			})
		})

		getLatestHighestAssessmentScoreRecord(123).then(result => {
			expect(result).toEqual({
				id: 'id',
				userId: 'user_id',
				draftId: 'draft_id',
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

		db.oneOrNone.mockImplementationOnce((query, vars) => {
			return Promise.resolve(null)
		})

		getLatestHighestAssessmentScoreRecord(123)
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
		db.oneOrNone.mockImplementationOnce((query, vars) => {
			return Promise.resolve({
				properties: 'properties'
			})
		})

		lti.getLatestSuccessfulLTIAssessmentScoreRecord(123).then(result => {
			expect(result).toEqual({
				properties: 'properties'
			})

			done()
		})
	})

	test('send same assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			// expect(insertEvent).lastCalledWith({
			// 	action: 'lti:replaceResult',
			// 	actorTime: 'MOCKED-ISO-DATE-STRING',
			// 	payload: {
			// 		launchId: 'launch-id',
			// 		launchKey: 'testkey',
			// 		body: {
			// 			lis_outcome_service_url: 'lis_outcome_service_url',
			// 			lis_result_sourcedid: 'lis_result_sourcedid'
			// 		},
			// 		assessmentScore: {
			// 			id: 'assessment-score-id',
			// 			userId: 'user-id',
			// 			draftId: 'draft-id',
			// 			assessmentId: 'assessment-id',
			// 			attemptId: 'attempt-id',
			// 			score: 100,
			// 			preview: false,
			// 			error: null
			// 		},
			// 		result: {
			// 			launchId: 'launch-id',
			// 			scoreSent: 1,
			// 			status: 'success',
			// 			statusDetails: null,
			// 			gradebookStatus: 'ok_gradebook_matches_assessment_score',
			// 			dbStatus: 'recorded',
			// 			ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			// 		}
			// 	},
			// 	userId: 'user-id',
			// 	ip: '',
			// 	eventVersion: '2.0.0',
			// 	metadata: {},
			// 	draftId: 'draft-id'
			// })

			done()
		})
	})

	test('send different assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('send first assessment score results in "success" and "ok_gradebook_matches_assessment"', done => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'success',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('send null assessment score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('send assessment score with no outcome results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
		mockSendAssessScoreDBCalls(null, null, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('replaceResult fail for same score results in "error_replace_result_failed" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'error_replace_result_failed',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('replaceResult fail for different score results in "error_replace_result_failed" and "error_newer_assessment_score_unsent"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: 1,
				status: 'error_replace_result_failed',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('missing key for newer assessment score results in "error_no_secret_for_key" and "error_newer_assessment_score_unsent"', done => {
		mockSendAssessScoreDBCalls(100, null, moment().toISOString(), true, true, 'nokey')

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_no_secret_for_key',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('missing key for same assessment score results in "error_no_secret_for_key" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true, 'nokey')

		// expect(logger.error.mock.calls).toBe(1)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_no_secret_for_key',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	//@TODO
	test('no assessment score results in "error_no_assessment_score_found" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls('missing', 1, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_assessment_score_found',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('no launch for different score results in "error_no_launch_found" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls(100, 0.5, moment().toISOString(), false, 'missing')

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_launch_found',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('no launch for same score results in "error_no_launch_found" and "ok_gradebook_matches_assessment_score"', done => {
		mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), false, 'missing')

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'error_no_launch_found',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('no launch for null score results in "not_attempted_score_is_null" and "ok_null_score_not_sent"', done => {
		mockSendAssessScoreDBCalls(null, 1, moment().toISOString(), false, 'missing')

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: null,
				scoreSent: null,
				status: 'not_attempted_score_is_null',
				statusDetails: null,
				gradebookStatus: 'ok_null_score_not_sent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
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

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_launch_expired',
				statusDetails: null,
				gradebookStatus: 'ok_gradebook_matches_assessment_score',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
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

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_launch_expired',
				statusDetails: null,
				gradebookStatus: 'error_newer_assessment_score_unsent',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
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

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
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

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('expired launch for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
		mockSendAssessScoreDBCalls(
			'doggo',
			1,
			moment()
				.subtract(1, 'days')
				.toISOString(),
			true,
			false
		)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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
			expect(logger.info.mock.calls[6]).toEqual(['LTI complete', logId])

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_no_outcome_service_for_launch',
				statusDetails: null,
				gradebookStatus: 'ok_no_outcome_service',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('invalid score results in "error_score_is_invalid" and "error_state_unknown"', done => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, true)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'error_score_is_invalid',
				statusDetails: null,
				gradebookStatus: 'error_state_unknown',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('invalid score for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
		mockSendAssessScoreDBCalls('doggo', 1, moment().toISOString(), true, false)

		lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
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

			// expect(insertEvent).lastCalledWith({
			// 	action: 'lti:replaceResult',
			// 	actorTime: 0,
			// 	payload: {
			// 		launchId: 'launch-id',
			// 		launchKey: 'launch-key',
			// 		body: {
			// 			lis_outcome_service_url: 'lis_outcome_service_url',
			// 			lis_result_sourcedid: 'lis_result_sourcedid'
			// 		},
			// 		assessmentScore: {},
			// 		result: {}
			// 	},
			// 	userId: 'user-id',
			// 	ip: '',
			// 	eventVersion: '2.0.0',
			// 	metadata: {},
			// 	draftId: 'draft-id'
			// })

			expect(result).toEqual({
				launchId: 'launch-id',
				scoreSent: null,
				status: 'not_attempted_no_outcome_service_for_launch',
				statusDetails: null,
				gradebookStatus: 'ok_no_outcome_service',
				dbStatus: 'recorded',
				ltiAssessmentScoreId: 'new-lti-assessment-score-id'
			})

			done()
		})
	})

	test('getLTIStatesByAssessmentIdForUserAndDraft returns expected values', done => {
		db.manyOrNone.mockImplementationOnce((query, vars) => {
			return Promise.resolve([
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
		})

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

	test('getLTIStatesByAssessmentIdForUserAndDraft returns empty object when nothing returned from database', done => {
		db.manyOrNone.mockImplementationOnce((query, vars) => {
			return Promise.resolve(null)
		})

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
		class MockedReqVars {
			get lis_outcome_service_url() {
				throw new Error('Some Unexpected Error')
			}
		}

		let rtn = lti.getOutcomeServiceForLaunch({
			key: 'testkey',
			reqVars: new MockedReqVars()
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

	// test.only('invalid score for no outcome launch results in "not_attempted_no_outcome_service_for_launch" and "ok_no_outcome_service"', done => {
	// 	let insertEvent = oboRequire('insert_event')

	// 	mockSendAssessScoreDBCalls(100, 1, moment().toISOString(), true, true)

	// 	mockDate()

	// 	lti.sendHighestAssessmentScore('user-id', 'draft-id', 'assessment-id').then(result => {
	// 		expect(insertEvent).lastCalledWith({
	// 			action: 'lti:replaceResult',
	// 			actorTime: 'MOCKED-ISO-DATE-STRING',
	// 			payload: {
	// 				launchId: 'launch-id',
	// 				launchKey: 'testkey',
	// 				body: {
	// 					lis_outcome_service_url: 'lis_outcome_service_url',
	// 					lis_result_sourcedid: 'lis_result_sourcedid'
	// 				},
	// 				assessmentScore: {
	// 					id: 'assessment-score-id',
	// 					userId: 'user-id',
	// 					draftId: 'draft-id',
	// 					assessmentId: 'assessment-id',
	// 					attemptId: 'attempt-id',
	// 					score: 100,
	// 					preview: false,
	// 					error: null
	// 				},
	// 				result: {
	// 					launchId: 'launch-id',
	// 					scoreSent: 1,
	// 					status: 'success',
	// 					statusDetails: null,
	// 					gradebookStatus: 'ok_gradebook_matches_assessment_score',
	// 					dbStatus: 'error', // this should be 'recorded'
	// 					ltiAssessmentScoreId: 'new-lti-assessment-score-id'
	// 				}
	// 			},
	// 			userId: 'user-id',
	// 			ip: '',
	// 			eventVersion: '2.0.0',
	// 			metadata: {},
	// 			draftId: 'draft-id'
	// 		})

	// 		done()
	// 	})
	// })
})
