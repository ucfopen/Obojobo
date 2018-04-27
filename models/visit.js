let db = require('../db')
let logger = require('../logger.js')

class Visit {
	constructor(visitProps){
		// expand all the visitProps onto this object
		for(let prop in visitProps){
			this[prop] = visitProps[prop]
		}
	}

	static fetchById(visitId) {
		return db.one(
			`
			SELECT is_active, is_preview, draft_content_id
			FROM visits
			WHERE id = $[visitId]
			AND is_active = true
			ORDER BY created_at DESC
			LIMIT 1
		`,
			{visitId}
		).then(result => new Visit(result))
		.catch(error => {
			logger.error('Visit fetchById Error', error.message)
			return Promise.reject(error)
		})
	}
}

module.exports = Visit
