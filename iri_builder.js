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
		return createIRI(host, '/')
	},

	// getViewerClientIRI: host => {
	// 	return createIRI(host, '/viewer/client')
	// },

	getSessionIRI: (host, sessionId) => {
		return createIRI(host, `/session/${sessionId}`)
	},

	getFederatedSessionIRI: (host, launchId) => {
		return createIRI(host, `/launch/${launchId}`)
	},

	getUserIRI: (host, userId) => {
		return createIRI(host, `/user/${userId}`)
	},

	getViewIRI: (host, draftId, oboNodeId = null, contextName = null) => {
		let iri

		if (oboNodeId === null) {
			iri = createIRI(host, `/view/${draftId}`)
		} else if (contextName === null) {
			iri = createIRI(host, `/view/${draftId}`, `#${oboNodeId}`)
		} else {
			iri = createIRI(host, `/view/${draftId}`, `#${oboNodeId}`, { context: contextName })
		}

		return iri
	},

	getPracticeQuestionAttemptIRI: (host, draftId, oboNodeId) => {
		return createIRI(host, `/practice/${draftId}/${oboNodeId}`)
	},

	getAssessmentIRI: (host, draftId, assessmentId) => {
		return createIRI(host, `/assessment/${draftId}/${assessmentId}`)
	},

	getAssessmentAttemptIRI: (host, draftId, assessmentId, attemptId) => {
		return createIRI(host, `/assessment/${draftId}/${assessmentId}/attempt/${attemptId}`)
	}
}

module.exports = IRI
