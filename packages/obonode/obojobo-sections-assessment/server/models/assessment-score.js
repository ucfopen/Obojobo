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

	clone(){
		const clone = Object.assign({}, this)
		return new AssessmentScore(clone)
	}

	create(theDb = db){
		if(this.id) throw 'E'
		return theDb.one(`
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

	importAsNewScore(){
		const newScore = this.clone()
		console.log(newScore)

		delete newScore.id
		newScore.isImported = true
		newScore.importedAssessmentScoreId = this.id
		// dispatch an event?
		// store a caliper event?
		console.log(newScore)
		return newScore.create()
	}


}


module.exports = AssessmentScore
