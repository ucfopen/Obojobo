const { filterModules, filterCollections } = require('./filter-functions')

const mockDrafts = [
	{ title: 'a' },
	{ draftId: 'a' },
	{ title: 'b', draftId: '2' },
	{ title: 'd', draftId: '4' }
]

const mockCollections = [{ title: 'a' }, { id: '1' }, { title: 'b', id: '2' }]

describe('repository filter functions for modules and collections', () => {
	// draft IDs are included in the filterable string by default
	test('filterModules filters correctly - default', () => {
		let filteredModules

		// no search string - return everything
		filteredModules = filterModules(mockDrafts, '')
		expect(filteredModules).toEqual(mockDrafts)

		// filters on title
		filteredModules = filterModules(mockDrafts, 'a')
		expect(filteredModules).toEqual([mockDrafts[0], mockDrafts[1]])

		// filters on draft ID
		filteredModules = filterModules(mockDrafts, '2')
		expect(filteredModules).toEqual([mockDrafts[2]])

		// filters on title or draft ID
		filteredModules = filterModules(mockDrafts, 'd4')
		// matches becuase draft ID is concatenated to draft title
		expect(filteredModules).toEqual([mockDrafts[3]])
	})

	test('filterModules filters correctly - specify draft ID', () => {
		let filteredModules

		// no search string - return everything
		filteredModules = filterModules(mockDrafts, '', true)
		expect(filteredModules).toEqual(mockDrafts)

		// filters on title
		filteredModules = filterModules(mockDrafts, 'a', true)
		expect(filteredModules).toEqual([mockDrafts[0], mockDrafts[1]])

		// filters on draft ID
		filteredModules = filterModules(mockDrafts, '2', true)
		expect(filteredModules).toEqual([mockDrafts[2]])

		// filters on title or draft ID
		filteredModules = filterModules(mockDrafts, 'd4', true)
		// matches becuase draft ID is concatenated to draft title
		expect(filteredModules).toEqual([mockDrafts[3]])
	})

	test('filterModules filters correctly - omit draft ID', () => {
		let filteredModules

		// no search string - return everything
		filteredModules = filterModules(mockDrafts, '', false)
		expect(filteredModules).toEqual(mockDrafts)

		// filters on title
		filteredModules = filterModules(mockDrafts, 'a', false)
		expect(filteredModules).toEqual([mockDrafts[0]])

		// filters on draft ID
		filteredModules = filterModules(mockDrafts, '2', false)
		expect(filteredModules).toEqual([])

		// filters on title or draft ID
		filteredModules = filterModules(mockDrafts, 'd4', false)
		expect(filteredModules).toEqual([])
	})

	test('filterCollections filters correctly', () => {
		let filteredCollections

		// no search string - return everything
		filteredCollections = filterCollections(mockCollections, '')
		expect(filteredCollections).toEqual(mockCollections)

		// filters on title
		filteredCollections = filterCollections(mockCollections, 'a')
		expect(filteredCollections).toEqual([mockCollections[0]])

		// filters on ID
		filteredCollections = filterCollections(mockCollections, '1')
		expect(filteredCollections).toEqual([mockCollections[1]])

		// filters on title or ID
		filteredCollections = filterCollections(mockCollections, 'b2')
		expect(filteredCollections).toEqual([mockCollections[2]])
	})
})
