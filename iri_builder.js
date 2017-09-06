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

const IRI = {
	getIRI: (host, path) => {
		return createIRI(host, `${path}`)
	},

	getEdAppIRI: host => {
		return createIRI(host, '/api/system')
	},

	getViewerClientIRI: host => {
		return createIRI(host, '/api/viewer/client')
	},

	getAppServerIRI: host => {
		return createIRI(host, '/api/server')
	},

	getSessionIRI: (host, sessionId) => {
		return createIRI(host, `/api/session/${sessionId}`)
	},

	getFederatedSessionIRI: (host, launchId) => {
		return createIRI(host, `/api/launch/${launchId}`)
	},

	getUserIRI: (host, userId) => {
		return createIRI(host, `/api/user/${userId}`)
	},

	getDraftIRI: (host, draftId, oboNodeId = null, contextName = null) => {
		let iri

		if (oboNodeId === null) {
			iri = createIRI(host, `/api/draft/${draftId}`)
		} else if (contextName === null) {
			iri = createIRI(host, `/api/draft/${draftId}`, `#${oboNodeId}`)
		} else {
			iri = createIRI(host, `/api/draft/${draftId}`, `#${oboNodeId}`, { context: contextName })
		}

		return iri
	},

	getPracticeQuestionAttemptIRI: (host, draftId, oboNodeId) => {
		return createIRI(host, `/api/practice/${draftId}/${oboNodeId}`)
	},

	getAssessmentIRI: (host, draftId, assessmentId) => {
		return createIRI(host, `/api/assessment/${draftId}/${assessmentId}`)
	},

	getAssessmentAttemptIRI: (host, attemptId) => {
		return createIRI(host, `/api/attempt/${attemptId}`)
	}
}

module.exports = IRI
