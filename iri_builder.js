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

		getViewerClientIRI: () => {
			return createIRI(host, '/api/viewer/client')
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

		getDraftIRI: (draftId, oboNodeId = null, contextName = null) => {
			let iri

			if (oboNodeId === null) {
				iri = createIRI(`/api/draft/${draftId}`)
			} else if (contextName === null) {
				iri = createIRI(host, `/api/draft/${draftId}`, `#${oboNodeId}`)
			} else {
				iri = createIRI(host, `/api/draft/${draftId}`, `#${oboNodeId}`, { context: contextName })
			}

			return iri
		},

		getPracticeQuestionAttemptIRI: (draftId, oboNodeId) => {
			return createIRI(host, `/api/practice/${draftId}/${oboNodeId}`)
		},

		getAssessmentIRI: (draftId, assessmentId) => {
			return createIRI(host, `/api/assessment/${draftId}/${assessmentId}`)
		},

		getAssessmentAttemptIRI: attemptId => {
			return createIRI(host, `/api/attempt/${attemptId}`)
		}
	}
}

module.exports = iriFactory
