const oboEvents = require('obojobo-express/obo_events')
const logger = require('obojobo-express/logger')
const db = require('obojobo-express/db')
const DraftModel = require('obojobo-express/models/draft')

// when a new draft is created make sure we create an ownership association
oboEvents.on(DraftModel.EVENT_NEW_DRAFT_CREATED, (newDraft) => {
	return db
		.none(`
			INSERT INTO repository_map_user_to_draft
			(draft_id, user_id)
			VALUES($[draftId], $[userId])
			ON CONFLICT DO NOTHING
			`, {userId: newDraft.user_id, draftId: newDraft.id})
		.catch(logger.error)
})

// when a draft is deleted, remove all of it's permissions
oboEvents.on(DraftModel.EVENT_DRAFT_DELETED, () => {
	// remove all permissions for all deleted drafts
	return db
		.none(`
			DELETE FROM repository_map_user_to_draft
			USING drafts
			WHERE
			drafts.id = repository_map_user_to_draft.draft_id
			AND
			drafts.deleted = TRUE`)
		.catch(logger.error)
})


oboEvents.on('HTTP_NOT_AUTHORIZED', ({req, res, next}) => {
	req.responseHandled = true
	return req.getCurrentUser()
			.then(() => {
				const props = {
					title: 'Not Authorized',
					children: 'You do not have the permissions required to view this page.',
					currentUser: req.currentUser
				}
				res.render('page-error.jsx', props)
			})
})


oboEvents.on('HTTP_NOT_FOUND', ({req, res, next}) => {
	req.responseHandled = true
	return req.getCurrentUser()
			.then(() => {
				const props = {
					title: 'Not Found',
					children: "The page you requested doesn't exist.",
					currentUser: req.currentUser
				}
				res.render('page-error.jsx', props)
			})
})

oboEvents.on('HTTP_UNEXPECTED', ({req, res, next}) => {
	req.responseHandled = true
	return req.getCurrentUser()
			.then(() => {
				const props = {
					title: 'Unexpected Server Error',
					children: 'There was an internal server error.',
					currentUser: req.currentUser
				}
				res.render('page-error.jsx', props)
			})
})

