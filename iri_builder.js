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

	let host
	providedHost ? (host = providedHost) : (host = req.hostname)

	return {
		getIRI: path => {
			return createIRI(host, `${path}`)
		},

		getEdAppIRI: () => {
			return createIRI(host, '/api/system')
		},

		getViewerClientIRI: (draftId, contentId, element) => {
			if (element && draftId && contentId)
				return createIRI(host, `/api/viewer/client/${element}?draftId=${draftId}&contentId=${contentId}`)
			if (draftId && contentId) return createIRI(host, `/api/viewer/client?draftId=${draftId}&contentId=${contentId}`)
			if (draftId) return createIRI(host, `/api/viewer/client?draftId=${draftId}`)
			else return createIRI(host, '/api/viewer/client')
		},

		getAppServerIRI: () => {
			return createIRI(host, '/api/server')
		},

		getSessionIRI: sessionId => {
			return createIRI(host, `/api/session/${sessionId}`)
		},

		getFederatedSessionIRI: launchId => {
			return createIRI(host, `/api/launch/${launchId}`)
		},

		getUserIRI: userId => {
			return createIRI(host, `/api/user/${userId}`)
		},

		getDraftContentIRI: (contentId, oboNodeId = null, contextName = null) => {
			let iri

			if (oboNodeId === null) {
				iri = createIRI(host, `/api/draft-content/${contentId}`)
			} else if (contextName === null) {
				iri = createIRI(host, `/api/draft-content/${contentId}`, `#${oboNodeId}`)
			} else {
				iri = createIRI(host, `/api/draft-content/${contentId}`, `#${oboNodeId}`, { context: contextName })
			}

			return iri
		},

		getPracticeQuestionAttemptIRI: (contentId, oboNodeId) => {
			return createIRI(host, `/api/draft-content/${contentId}/practice/${oboNodeId}`)
		},

		getAssessmentIRI: (contentId, assessmentId) => {
			return createIRI(host, `/api/draft-content/${contentId}/assessment/${assessmentId}`)
		},

		getAssessmentAttemptIRI: attemptId => {
			return createIRI(host, `/api/attempt/${attemptId}`)
		},

		getPickerIRI: () => {
			return createIRI(host, `/api/picker`)
		},

		getVisitIRI: visitId => {
			return createIRI(host, `/api/visit/${visitId}`)
		}
	}
}

module.exports = iriFactory
