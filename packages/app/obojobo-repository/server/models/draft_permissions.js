const db = require('obojobo-express/db')
const User = require('obojobo-express/models/user')
const logger = require('obojobo-express/logger')

class DraftPermissions {

	static addOwnerToDraft(draftId, userId){
		return db.none(
			`INSERT INTO repository_map_user_to_draft
			(draft_id, user_id)
			VALUES($[draftId], $[userId])
			ON CONFLICT DO NOTHING`,
			{ userId, draftId }
		)
		.catch(error => {
			throw logger.logError('Error addOwnerToDraft', error)
		})
	}

	static removeOwnerFromDraft(draftId, userId){
		return db.none(
			`DELETE
			FROM repository_map_user_to_draft
			WHERE draft_id = $[draftId]
			AND user_id = $[userId]`,
			{ userId, draftId }
		)
		.catch(error => {
			throw logger.logError('Error removeOwnerFromDraft', error)
		})
	}

	static getDraftOwners(draftId){
		return 	db.manyOrNone(
			`SELECT
				users.*
			FROM repository_map_user_to_draft
			JOIN users
				ON users.id = user_id
			WHERE draft_id = $[draftId]
			ORDER BY users.first_name, users.last_name`,
			{ draftId }
		)
		.then(results => {
			return results.map(r => User.dbResultToModel(r))
		})
		.catch(error => {
			throw logger.logError('Error getDraftOwners', error)
		})
	}

}

module.exports = DraftPermissions
