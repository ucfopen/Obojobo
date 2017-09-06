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

		getViewerClientIRI: () => {
			return IRI.getViewerClientIRI(req.hostname)
		},

		getAppServerIRI: () => {
			return IRI.getAppServerIRI(req.hostname)
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

		getDraftIRI: (draftId, oboNodeId, frameName) => {
			return IRI.getDraftIRI(req.hostname, draftId, oboNodeId, frameName)
		},

		getPracticeQuestionAttemptIRI: (draftId, questionId) => {
			return IRI.getPracticeQuestionAttemptIRI(req.hostname, draftId, questionId)
		},

		getAssessmentIRI: (draftId, assessmentId) => {
			return IRI.getAssessmentIRI(req.hostname, draftId, assessmentId)
		},

		getAssessmentAttemptIRI: attemptId => {
			return IRI.getAssessmentAttemptIRI(req.hostname, attemptId)
		}
	}
}

module.exports = (req, res, next) => {
	req.iri = IRIBuilder(req)
	next()
}
