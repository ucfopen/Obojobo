let uuid = require('uuid').v4

let getUrnFromUuid = uuid => 'urn:uuid:' + uuid
let getNewGeneratedId = () => getUrnFromUuid(uuid())

module.exports = {
	getUrnFromUuid,
	getNewGeneratedId
}
