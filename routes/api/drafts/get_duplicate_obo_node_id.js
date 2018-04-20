// Saves ids into a idSet and returns the first duplicate
module.exports = (jsonTree, idSet = {}) => {
	let duplicateId = null

	if (!jsonTree.id) {
		return duplicateId
	}

	// If the current id is already in the set, it has been duplicated
	if (idSet.hasOwnProperty(jsonTree.id)) {
		return jsonTree.id
	}

	// Add the id to the set
	idSet[jsonTree.id] = true

	// Check all children ids for duplication
	for (let child of jsonTree.children) {
		duplicateId = module.exports(child, idSet)
		if (duplicateId) {
			return duplicateId
		}
	}

	return duplicateId
}
