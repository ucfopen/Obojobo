let url = require('url')

const createIRI = (host, path) => {
	return url.format({
		protocol: 'https',
		host: host,
		pathname: path
	})
}

const IRI = {
	getIRI: (host, path) => {
		return createIRI(host, `${path}`)
	},

	getSessionIRI: (host, sessionId) => {
		return createIRI(host, `/sessions/${sessionId}`)
	},

	getUserIRI: (host, userId) => {
		return createIRI(host, `/users/${userId}`)
	},

	getViewIRI: (host, id, payload) => {
		return createIRI(host, `/view/${id}/${payload}`)
	}
}

module.exports = IRI
