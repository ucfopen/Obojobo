const db = require('obojobo-express/db')
const camelcaseKeys = require('camelcase-keys')
// const draftNodeStore = oboRequire('draft_node_store')
const logger = require('obojobo-express/logger')
// const oboEvents = oboRequire('obo_events')


class AssessmentScore {
	constructor(props) {
		// set some defaults
		this.isPreview = false
		this.isImported = false
		this.importedAssessmentScoreId = null

		// expand all the props onto this object with camel case keys
		props = camelcaseKeys(props)
		for (const prop in props) {
			this[prop] = props[prop]
		}

		// number format certain fields
		this.id = parseInt(this.id, 10)
		this.assessmentScoreId = parseInt(this.assessmentScoreId, 10)
		if(this.score) this.score = parseFloat(this.score)
	}

	static fetchById(id) {
		return db
			.one(
				`
			SELECT
				*
			FROM assessment_scores
			WHERE id = $[id]
			LIMIT 1
			`,
				{ id }
			)
			.then(result => {
				return new AssessmentScore(result)
			})
			.catch(error => {
				logger.error('AssessmentScore fetchById Error', error.message)
				return Promise.reject(error)
			})
	}

	static getImportableScore(userId, draftContentId, isPreview){
		return db
			.oneOrNone(`
				SELECT
					id,
					created_at,
					assessment_id,
					score,
					attempt_id
				FROM assessment_scores
				WHERE
					user_id = $[userId]
					AND draft_content_id = $[draftContentId]
					AND is_preview = $[isPreview]
					AND is_imported = false
				ORDER BY
					score DESC,
					created_at DESC
				LIMIT 1
				`,
				{
					userId,
					isPreview,
					draftContentId
				})
			.then(result => {
				if(result){
					return new AssessmentScore(result)
				}
			})
	}

	static deletePreviewScores({ transaction, userId, draftId, resourceLinkId }) {
		return transaction
			.manyOrNone(
				`
				SELECT assessment_scores.id
				FROM assessment_scores
				JOIN attempts
					ON attempts.id = assessment_scores.attempt_id
				WHERE assessment_scores.user_id = $[userId]
				AND assessment_scores.draft_id = $[draftId]
				AND attempts.resource_link_id = $[resourceLinkId]
				AND assessment_scores.is_preview = true
			`,
				{ userId, draftId, resourceLinkId }
			)
			.then(assessmentScoreIdsResult => {
				const ids = assessmentScoreIdsResult.map(i => i.id)
				if (ids.length < 1) return []

				return [
					transaction.none(
						`
						DELETE FROM lti_assessment_scores
						WHERE assessment_score_id IN ($[ids:csv])
					`,
						{ ids }
					),
					transaction.none(
						`
						DELETE FROM assessment_scores
						WHERE id IN ($[ids:csv])
					`,
						{ ids }
					)
				]
			})
	}

	clone(){
		const clone = Object.assign({}, this)
		return new AssessmentScore(clone)
	}

	create(dbOrTransaction = db){
		if(this.id) throw 'Cannot call create on a model that has an id'
		return dbOrTransaction.one(`
			INSERT INTO assessment_scores
				(user_id, draft_id, draft_content_id, assessment_id, attempt_id, score, score_details, is_preview, is_imported, imported_assessment_score_id)
				VALUES($[userId], $[draftId], $[draftContentId], $[assessmentId], $[attemptId], $[score], $[scoreDetails], $[isPreview], $[isImported], $[importedAssessmentScoreId])
				RETURNING id
			`, this)
			.then(result => {
				this.id = result.id
				return this
			})
	}

	importAsNewScore(attemptId, resourceLinkId, dbTransaction){
		const newScore = this.clone()
		delete newScore.id
		newScore.attemptId = attemptId
		newScore.isImported = true
		newScore.importedAssessmentScoreId = this.id // use original item as imported id
		newScore.resourceLinkId = resourceLinkId // update resourceLink
		newScore.scoreDetails.attemptNumber = 1 // fix the attemptNumber
		// dispatch an event?
		// store a caliper event?
		return newScore.create(dbTransaction)
	}

}


module.exports = AssessmentScore
