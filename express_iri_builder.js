let IRI = oboRequire('iri_builder')

let IRIbuilder = req => {
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

		getUserIRI: id => {
			return IRI.getUserIRI(req.hostname, id)
		},

		getViewIRI: (draftId, oboNodeId) => {
			return IRI.getViewIRI(req.hostname, draftId, oboNodeId)
		}
	}
}

module.exports = (req, res, next) => {
	req.iri = IRIbuilder(req)
	next()
}
