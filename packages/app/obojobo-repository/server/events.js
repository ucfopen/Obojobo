const oboEvents = require('obojobo-express/server/obo_events')
const logger = require('obojobo-express/server/logger')
const db = require('obojobo-express/server/db')
const DraftModel = require('obojobo-express/server/models/draft')
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const appCSSUrl = webpackAssetPath('repository.css')

// when a new draft is created make sure we create an ownership association
oboEvents.on(DraftModel.EVENT_NEW_DRAFT_CREATED, newDraft => {
	return db
		.none(
			`
			INSERT INTO repository_map_user_to_draft
			(draft_id, user_id)
			VALUES($[draftId], $[userId])
			ON CONFLICT DO NOTHING
			`,
			{ userId: newDraft.user_id, draftId: newDraft.id }
		)
		.catch(logger.error)
})

// 401 Error Page
oboEvents.on('HTTP_NOT_AUTHORIZED', ({ req, res, next }) => {
	req.responseHandled = true
	return req.getCurrentUser().then(() => {
		const props = {
			title: 'Not Authorized',
			children: 'You do not have the permissions required to view this page.',
			currentUser: req.currentUser,
			appCSSUrl,
			globals: {
				staticAssetUrl: process.env.CDN_ASSET_HOST || ''
			}
		}
		res.render('pages/page-error.jsx', props)
	})
})

// 404 Error Page
oboEvents.on('HTTP_NOT_FOUND', ({ req, res, next }) => {
	req.responseHandled = true
	return req.getCurrentUser().then(() => {
		const props = {
			title: 'Not Found',
			children: "The page you requested doesn't exist.",
			currentUser: req.currentUser,
			appCSSUrl,
			globals: {
				staticAssetUrl: process.env.CDN_ASSET_HOST || ''
			}
		}
		res.render('pages/page-error.jsx', props)
	})
})

// 500 Error Page
oboEvents.on('HTTP_UNEXPECTED', ({ req, res, next }) => {
	req.responseHandled = true
	return req.getCurrentUser().then(() => {
		const props = {
			title: 'Unexpected Server Error',
			children: 'There was an internal server error.',
			currentUser: req.currentUser,
			appCSSUrl,
			globals: {
				staticAssetUrl: process.env.CDN_ASSET_HOST || ''
			}
		}
		res.render('pages/page-error.jsx', props)
	})
})
