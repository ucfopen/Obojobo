const whitespaceRegex = /\s+/g

function filterModules(modules, searchString, includeDraftId = true) {
	searchString = ('' + searchString).replace(whitespaceRegex, '').toLowerCase()

	return modules.filter(m =>
		((m.title || '') + (includeDraftId ? m.draftId : ''))
			.replace(whitespaceRegex, '')
			.toLowerCase()
			.includes(searchString)
	)
}
function filterCollections(collections, searchString) {
	searchString = ('' + searchString).replace(whitespaceRegex, '').toLowerCase()

	return collections.filter(c =>
		((c.title || '') + c.id)
			.replace(whitespaceRegex, '')
			.toLowerCase()
			.includes(searchString)
	)
}

module.exports = {
	filterModules,
	filterCollections
}
