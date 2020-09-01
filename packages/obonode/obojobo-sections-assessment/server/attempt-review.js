const AssessmentModel = require('./models/assessment')
const attemptStart = require('./attempt-start')
const DraftModel = require('obojobo-express/server/models/draft')
const { getFullQuestionsFromDraftTree } = require('./util')
const logger = require('obojobo-express/server/logger')

// Extract draft caching to another function?
const getQuestionModelsFromAttempt = async (
	attemptId,
	getDraftByVersion,
	getCompletedAttemptsCount
) => {
	const attempt = await AssessmentModel.fetchAttemptById(attemptId)
	const draftDocument = await getDraftByVersion(attempt.draftId, attempt.draftContentId)
	const assessmentNode = draftDocument.getChildNodeById(attempt.assessmentId)

	let concealScores
	switch (assessmentNode.node.content.review) {
		case 'no-attempts-remaining':
			// code block used to keep scope clean in 'case'
			{
				// default to hide
				concealScores = true
				const attemptsAllowed = parseInt(assessmentNode.node.content.attempts, 10)
				const completedAttemptCount = await getCompletedAttemptsCount(
					attempt.userId,
					attempt.draftId,
					attempt.assessmentId,
					attempt.isPreview,
					attempt.resourceLinkId
				)

				concealScores = completedAttemptCount < attemptsAllowed
			}
			break

		case 'never':
			concealScores = true
			break

		case 'always':
		default:
			concealScores = false
			break
	}

	// let the nodes prep content to send to the client
	if (concealScores) {
		const res = {}
		const req = {}
		await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))
	}

	const attemptQuestionModels = getFullQuestionsFromDraftTree(draftDocument, attempt.state.chosen)

	const attemptQuestionModelsMap = {}
	for (const questionModel of attemptQuestionModels) {
		attemptQuestionModelsMap[questionModel.id] = questionModel
	}

	return attemptQuestionModelsMap
}

// returns a function that loads a draft document
// calling that returned function again with the same arguments will return a cached value
// the cache is scoped to the memoized function, call memoGetDraftByVersion twice
// and you'll receive 2 different functions with 2 different caches
// the cache should be garbage collected after the reference to the returned function is cleaned up
const memoGetDraftByVersion = () => {
	const cache = {} // a place to cache draftDocuments for reuse
	return async (draftId, draftContentId) => {
		const cacheKey = draftContentId
		if (!cache[cacheKey]) {
			cache[cacheKey] = await DraftModel.fetchDraftByVersion(draftId, draftContentId)
		}

		return cache[cacheKey]
	}
}

// returns a function that loads attempt history and extracts the number of finished attempts
// calling that returned function again with the same arguments will return a cached value
// the cache is scoped to the memoized function, call memoGetCompletedAttemptsCount twice
// and you'll receive 2 different functions with 2 different caches
// the cache should be garbage collected after the reference to the returned function is cleaned up
const memoGetCompletedAttemptsCount = () => {
	const cache = {}
	return async (userId, draftId, assessmentId, isPreview, resourceLinkId) => {
		const cacheKey = `${userId}_${draftId}_${assessmentId}_${isPreview}_${resourceLinkId}`

		if (!cache[cacheKey]) {
			const history = await AssessmentModel.getCompletedAssessmentAttemptHistory(
				userId,
				draftId,
				assessmentId,
				isPreview,
				resourceLinkId
			)

			// count attempts with final attemptScore
			let finishedAttemptCount = 0
			history.forEach(attempt => {
				// attempt.result is null when incomplete
				if (attempt.result && attempt.result.attemptScore) finishedAttemptCount++
			})

			cache[cacheKey] = finishedAttemptCount
		}

		return cache[cacheKey]
	}
}

const attemptReview = async attemptIds => {
	try {
		const results = []
		const getDraftByVersion = memoGetDraftByVersion()
		const getCompletedAttemptsCount = memoGetCompletedAttemptsCount()

		// aysnc, let's get all the attempts
		for (const attemptId of attemptIds) {
			results.push(
				await getQuestionModelsFromAttempt(attemptId, getDraftByVersion, getCompletedAttemptsCount)
			)
		}

		// now build an object
		// { <attemptId>: questionModels }
		let n = 0
		const questionModels = {}
		for (const attemptId of attemptIds) {
			questionModels[attemptId] = results[n]
			n++
		}

		return questionModels
	} catch (error) {
		logger.error('attemptReview Error')
		logger.error(error)
	}
}

module.exports = {
	attemptReview,
	memoGetCompletedAttemptsCount,
	memoGetDraftByVersion,
	getQuestionModelsFromAttempt
}
