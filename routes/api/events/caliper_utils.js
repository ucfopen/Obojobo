let uuid = require('uuid').v4

let getUrnFromUuid = uuid => 'urn:uuid:' + uuid
let getNewGeneratedId = () => getUrnFromUuid(uuid())

let getSessionIds = session => {
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
