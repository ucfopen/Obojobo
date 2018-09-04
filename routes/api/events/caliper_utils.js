const uuid = require('uuid').v4

const getUrnFromUuid = uuid => 'urn:uuid:' + uuid
const getNewGeneratedId = () => getUrnFromUuid(uuid())

const getSessionIds = session => {
	let sessionId, launchId
	if (session) {
		if (session.id) sessionId = session.id
		if (session.oboLti) launchId = session.oboLti.launchId
	}
	return { sessionId, launchId }
}

module.exports = {
	getUrnFromUuid,
	getNewGeneratedId,
	getSessionIds
}
