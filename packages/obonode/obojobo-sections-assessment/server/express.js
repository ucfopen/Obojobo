const uuid = require('uuid').v4
const router = require('express').Router() //eslint-disable-line new-cap
const AssessmentModel = require('./models/assessment')
const lti = require('obojobo-express/server/lti')
const logger = require('obojobo-express/server/logger')
const { startAttempt } = require('./attempt-start')
const resumeAttempt = require('./attempt-resume')
const endAttempt = require('./attempt-end/attempt-end')
const { attemptReview } = require('./attempt-review')
const attemptImport = require('./attempt-end/attempt-import')
const { logAndRespondToUnexpected } = require('./util')
const {
	requireCurrentDocument,
	requireCurrentVisit,
	requireAttemptId,
	requireMultipleAttemptIds,
	requireCurrentUser,
	requireAssessmentId,
	checkValidationRules,
	validImportedAssessmentScoreId
} = require('obojobo-express/server/express_validators')
const {
	ERROR_INVALID_ATTEMPT_END,
	ERROR_UNEXPECTED_ATTEMPT_END,
	ERROR_INVALID_ATTEMPT_RESUME,
	ERROR_UNEXPECTED_ATTEMPT_RESUME,
	ERROR_NO_PERMISSIONS_TO_DATA
} = require('./error-constants')
const DraftPermissions = require('obojobo-repository/server/models/draft_permissions')

// load the server event listeners
require('./events')

router
	.route('/api/lti/send-assessment-score')
	.post([
		requireCurrentVisit,
		requireCurrentUser,
		requireCurrentDocument,
		requireAssessmentId,
		checkValidationRules
	])
	.post(async (req, res) => {
		try {
			logger.info(
				`API sendAssessmentScore with userId="${req.currentUser.id}", draftId="${req.currentDocument.draftId}", assessmentId="${req.body.assessmentId}"`
			)
			const ltiScoreResult = await lti.sendHighestAssessmentScore(
				req.currentUser.id,
				req.currentDocument,
				req.body.assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id,
				req.currentVisit.id
			)

			res.success({
				score: ltiScoreResult.scoreSent,
				status: ltiScoreResult.status,
				statusDetails: ltiScoreResult.statusDetails,
				dbStatus: ltiScoreResult.dbStatus,
				gradebookStatus: ltiScoreResult.gradebookStatus
			})
		} catch (e) {
			logAndRespondToUnexpected('Unexpected error starting a new attempt', res, req, e)
		}
	})

// @TODO: break startAttempt out so it doesn't need req, res
router
	.route('/api/assessments/attempt/start')
	.post([
		requireCurrentUser,
		requireCurrentVisit,
		requireCurrentDocument,
		requireAssessmentId,
		checkValidationRules
	])
	.post(startAttempt)

router
	.route('/api/assessments/attempt/:attemptId/resume')
	.post([
		requireCurrentUser,
		requireCurrentDocument,
		requireCurrentVisit,
		requireAttemptId,
		checkValidationRules
	])
	.post(async (req, res) => {
		try {
			const attempt = await resumeAttempt(
				req.currentUser,
				req.currentVisit,
				req.currentDocument,
				req.params.attemptId,
				req.hostname,
				req.connection.remoteAddress
			)

			res.success(attempt)
		} catch (error) {
			let errorMessage = ''

			switch (error.message) {
				case ERROR_INVALID_ATTEMPT_RESUME:
					errorMessage = ERROR_INVALID_ATTEMPT_RESUME
					break
				default:
					errorMessage = ERROR_UNEXPECTED_ATTEMPT_RESUME
			}

			logAndRespondToUnexpected(errorMessage, res, req, error)
		}
	})

router
	.route('/api/assessments/attempt/:attemptId/end')
	.post([
		requireCurrentVisit,
		requireCurrentUser,
		requireCurrentDocument,
		requireAttemptId,
		checkValidationRules
	])
	.post((req, res) => {
		return endAttempt(req, res)
			.then(res.success)
			.catch(error => {
				let errorMessage = ''

				switch (error.message) {
					case ERROR_INVALID_ATTEMPT_END:
						errorMessage = ERROR_INVALID_ATTEMPT_END
						break
					default:
						errorMessage = ERROR_UNEXPECTED_ATTEMPT_END
				}

				logAndRespondToUnexpected(errorMessage, res, req, error)
			})
	})

// @TODO: seems like attemptid should be in the url and switch to GET?
router
	.route('/api/assessments/attempt/review')
	.post([requireCurrentUser, requireMultipleAttemptIds, checkValidationRules])
	.post(async (req, res) => {
		const questionModels = await attemptReview(req.body.attemptIds)
		// convert key based objects to arrays for use in the api
		const attemptsArray = []
		for (const [attemptId, questionsMap] of Object.entries(questionModels)) {
			const questions = Object.values(questionsMap)
			attemptsArray.push({ attemptId, questions })
		}
		res.send(attemptsArray)
	})

router
	.route('/api/assessments/clear-preview-scores')
	.post([requireCurrentUser, requireCurrentVisit, requireCurrentDocument])
	.post(async (req, res) => {
		if (!req.currentVisit.is_preview) return res.notAuthorized('Not in preview mode')

		try {
			await AssessmentModel.deletePreviewAttemptsAndScores(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.resource_link_id
			)
			res.success()
		} catch (error) {
			logAndRespondToUnexpected('Unexpected error clearing preview scores', res, req, error)
		}
	})

router
	.route('/api/assessments/:draftId/:assessmentId/import-score')
	.post([
		requireCurrentUser,
		requireCurrentDocument,
		requireCurrentVisit,
		requireAssessmentId,
		validImportedAssessmentScoreId,
		checkValidationRules
	])
	.post((req, res) => {
		return attemptImport(req, res)
			.then(res.success)
			.catch(error => {
				logAndRespondToUnexpected('Error importing score', res, req, error)
			})
	})

router
	.route('/api/assessments/:draftId/attempts')
	.get([requireCurrentUser, requireCurrentVisit, requireCurrentDocument])
	.get((req, res) => {
		return AssessmentModel.fetchAttemptHistory(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id
		)
			.then(res.success)
			.catch(error => {
				logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
			})
	})

router
	.route('/api/courses/:draftId')
	.get([requireCurrentUser])
	.get((req, res) => {
		let currentUserHasPermissionToDraft

		return DraftPermissions.getUserAccessLevelToDraft(req.currentUser.id, req.params.draftId)
			.then(result => {
				currentUserHasPermissionToDraft = result !== null

				// Users must either have some level of permissions to this draft, or have
				// the canViewSystemStats permission
				if (
					!currentUserHasPermissionToDraft &&
					!req.currentUser.hasPermission('canViewSystemStats')
				) {
					throw Error(ERROR_NO_PERMISSIONS_TO_DATA)
				}

				return AssessmentModel.fetchCoursesByDraft(req.params.draftId)
			})
			.then(courseList => {
				// TODO: At this point, filter the list of courses the current user can view
				// by which courses they have Canvas permissions to.
				return res.success(courseList)
			})
			.catch(error => {
				switch (error.message) {
					case ERROR_NO_PERMISSIONS_TO_DATA:
						return res.notAuthorized()

					default:
						logAndRespondToUnexpected(
							'Unexpected error fetching course details',
							res,
							req,
							error
						)
				}
			})
		})

router
	.route('/api/assessments/:draftId/details')
	.get([requireCurrentUser])
	.get((req, res) => {
		let currentUserHasPermissionToDraft

		return DraftPermissions.getUserAccessLevelToDraft(req.currentUser.id, req.params.draftId)
			.then(result => {
				currentUserHasPermissionToDraft = result !== null

				// Users must either have some level of permissions to this draft, or have
				// the canViewSystemStats permission
				if (
					!currentUserHasPermissionToDraft &&
					!req.currentUser.hasPermission('canViewSystemStats')
				) {
					throw Error(ERROR_NO_PERMISSIONS_TO_DATA)
				}

				return AssessmentModel.fetchAttemptHistoryDetails(req.params.draftId)
			})
			.then(attemptsDetails => {
				// If the user doesn't own the draft (aka they only have canViewSystemStats),
				// anonymize the user data:
				if (!currentUserHasPermissionToDraft) {
					const anonUUIDsByUserId = {}
					attemptsDetails = attemptsDetails.map(attemptDetails => {
						if (!anonUUIDsByUserId[attemptDetails.user_id]) {
							anonUUIDsByUserId[attemptDetails.user_id] = uuid()
						}

						const userAnonUUID = anonUUIDsByUserId[attemptDetails.user_id]

						attemptDetails.user_username = `(anonymized-${userAnonUUID})`
						attemptDetails.user_first_name = `(anonymized-${userAnonUUID})`
						attemptDetails.user_last_name = `(anonymized-${userAnonUUID})`
						attemptDetails.user_id = `(anonymized-${userAnonUUID})`

						return attemptDetails
					})
				}

				return res.success(attemptsDetails)
			})
			.catch(error => {
				switch (error.message) {
					case ERROR_NO_PERMISSIONS_TO_DATA:
						return res.notAuthorized()

					default:
						logAndRespondToUnexpected(
							'Unexpected error fetching assessment details',
							res,
							req,
							error
						)
				}
			})
	})

router
	.route('/api/assessments/:draftId/course/:contextId/details')
	.get([requireCurrentUser])
	.get((req, res) => {
		let currentUserHasPermissionToDraft

		return DraftPermissions.getUserAccessLevelToDraft(req.currentUser.id, req.params.draftId)
			.then(result => {
				currentUserHasPermissionToDraft = result !== null

				// Users must either have some level of permissions to this draft, or have
				// the canViewSystemStats permission
				if (
					!currentUserHasPermissionToDraft &&
					!req.currentUser.hasPermission('canViewSystemStats')
				) {
					throw Error(ERROR_NO_PERMISSIONS_TO_DATA)
				}

				return AssessmentModel.fetchAttemptHistoryDetails(req.params.draftId, req.params.contextId)
			})
			.then(attemptsDetails => {
				// If the user doesn't own the draft (aka they only have canViewSystemStats),
				// anonymize the user data:
				if (!currentUserHasPermissionToDraft) {
					const anonUUIDsByUserId = {}
					attemptsDetails = attemptsDetails.map(attemptDetails => {
						if (!anonUUIDsByUserId[attemptDetails.user_id]) {
							anonUUIDsByUserId[attemptDetails.user_id] = uuid()
						}

						const userAnonUUID = anonUUIDsByUserId[attemptDetails.user_id]

						attemptDetails.user_username = `(anonymized-${userAnonUUID})`
						attemptDetails.user_first_name = `(anonymized-${userAnonUUID})`
						attemptDetails.user_last_name = `(anonymized-${userAnonUUID})`
						attemptDetails.user_id = `(anonymized-${userAnonUUID})`

						return attemptDetails
					})
				}

				return res.success(attemptsDetails)
			})
			.catch(error => {
				switch (error.message) {
					case ERROR_NO_PERMISSIONS_TO_DATA:
						return res.notAuthorized()

					default:
						logAndRespondToUnexpected(
							'Unexpected error fetching assessment details',
							res,
							req,
							error
						)
				}
			})
				
	})

// register the event listeners
require('./events')

module.exports = router
