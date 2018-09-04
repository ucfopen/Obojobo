let OboModel = require.requireActual('../src/scripts/common/models/obo-model').default

var localId = null

OboModel.__setNextGeneratedLocalId = n => {
	localId = n
}

var originalCreateNewLocalId = OboModel.prototype.createNewLocalId
OboModel.prototype.createNewLocalId = () => {
	if (localId !== null) {
		let id = localId
		localId = null

		return id
	}

	return originalCreateNewLocalId()
}

export default OboModel
