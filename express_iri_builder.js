let IRI = oboRequire('iri_builder')

let IRIBuilder = req => {
	return {
		getCurrentUserIRI: () => {
			return IRI.getUserIRI(req.hostname, req.currentUser.id)
		},

		getIRI: path => {
			return IRI.getIRI(req.hostname, path)
		},

		getEdAppIRI: () => {
			return IRI.getEdAppIRI(req.hostname)
		},

		getSessionIRI: () => {
			return IRI.getSessionIRI(req.hostname, req.session.id)
		},

		getFederatedSessionIRI: () => {
			return IRI.getFederatedSessionIRI(req.hostname, req.session.oboLti.launchId)
		},

		getUserIRI: id => {
			return IRI.getUserIRI(req.hostname, id)
		},

		getViewIRI: (draftId, oboNodeId) => {
			return IRI.getViewIRI(req.hostname, draftId, oboNodeId)
		},

		getAssessmentIRI: (draftId, assessmentId) => {
			return IRI.getAssessmentIRI(req.hostname, draftId, assessmentId)
		},

		getAssessmentAttemptIRI: (draftId, assessmentId, attemptId) => {
			return IRI.getAssessmentAttemptIRI(req.hostname, draftId, assessmentId, attemptId)
		}
	}
}

module.exports = (req, res, next) => {
	req.iri = IRIBuilder(req)
	next()
}
