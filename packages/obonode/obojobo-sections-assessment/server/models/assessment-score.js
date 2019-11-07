const db = require('obojobo-express/db')
const camelcaseKeys = require('camelcase-keys')
// const draftNodeStore = oboRequire('draft_node_store')
// const logger = require('../logger.js')
// const oboEvents = oboRequire('obo_events')


class AssessmentScore {
	constructor(props) {
		this.isPreview = false
		this.isImported = false
		this.importedAssessmentScoreId = null

		// expand all the visitProps onto this object
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
				logger.error('fetchById Error', error.message)
				return Promise.reject(error)
			})
	}

	create(db = db){
		return db.one(`
			INSERT INTO assessment_scores
				(user_id, draft_id, draft_content_id, assessment_id, attempt_id, score, score_details, is_preview, is_imported, imported_assessment_score_id)
				VALUES($[userId], $[draftId], $[contentId], $[assessmentId], $[attemptId], $[score], $[scoreDetails], $[isPreview], $[isImported], $[importedAssessmentScoreId])
				RETURNING id
			`, this)
			.then(id => {
				this.id = id
				return this
			})
	}



}


module.exports = AssessmentScore
