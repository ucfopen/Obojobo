let url = require('url')

const createIRI = (host, path, hash, query) => {
	return url.format({
		protocol: 'https',
		host: host,
		pathname: path,
		hash: hash,
		query: query
	})
}

const iriFactory = (req, providedHost) => {
	if (!req && !providedHost)
		throw Error('Must provide a request object with hostname or provide a host')

	let host = providedHost ? providedHost : req.hostname

	return {
		getIRI: path => createIRI(host, `${path}`),

		getEdAppIRI: () => createIRI(host, '/api/system'),

		getViewerClientIRI: (draftId, contentId, element) => {
			if (element && draftId && contentId)
				return createIRI(host, `/api/viewer/client/${element}?draftId=${draftId}&contentId=${contentId}`)
			if (draftId && contentId) return createIRI(host, `/api/viewer/client?draftId=${draftId}&contentId=${contentId}`)
			if (draftId) return createIRI(host, `/api/viewer/client?draftId=${draftId}`)
			else return createIRI(host, '/api/viewer/client')
		},

		getAppServerIRI: () => createIRI(host, '/api/server'),

		getSessionIRI: sessionId => createIRI(host, `/api/session/${sessionId}`),

		getFederatedSessionIRI: launchId => createIRI(host, `/api/launch/${launchId}`),

		getUserIRI: userId => createIRI(host, `/api/user/${userId}`),

		getDraftContentIRI: (contentId, oboNodeId = null, contextName = null) => {
			if (oboNodeId === null) {
				return createIRI(host, `/api/draft-content/${contentId}`)
			}
			if (contextName === null) {
				return createIRI(host, `/api/draft-content/${contentId}`, `#${oboNodeId}`)
			}
			return createIRI(host, `/api/draft-content/${contentId}`, `#${oboNodeId}`, { context: contextName })
		},

		getPracticeQuestionAttemptIRI: (contentId, oboNodeId) => createIRI(host, `/api/draft-content/${contentId}/practice/${oboNodeId}`),

		getAssessmentIRI: (contentId, assessmentId) => createIRI(host, `/api/draft-content/${contentId}/assessment/${assessmentId}`),

		getAssessmentAttemptIRI: attemptId => createIRI(host, `/api/attempt/${attemptId}`),

		getPickerIRI: () => createIRI(host, `/api/picker`),

		getVisitIRI: visitId => createIRI(host, `/api/visit/${visitId}`)
	}
}

module.exports = iriFactory
