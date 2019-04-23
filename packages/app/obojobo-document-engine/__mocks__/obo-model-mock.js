const OboModel = require.requireActual('../src/scripts/common/models/obo-model').default

let localId = null

OboModel.__setNextGeneratedLocalId = n => {
	localId = n
}

const originalCreateNewLocalId = OboModel.prototype.createNewLocalId
OboModel.prototype.createNewLocalId = () => {
	if (localId !== null) {
		const id = localId
		localId = null

		return id
	}

	return originalCreateNewLocalId()
}

export default OboModel
