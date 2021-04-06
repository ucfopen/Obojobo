jest.mock('obojobo-lib-utils')
const utils = require('obojobo-lib-utils')

describe('NameTransformer', () => {
	beforeEach(function() {
		jest.resetAllMocks()
	})

	test('registers parsers configured in modules', () => {
		// mock a parser file config
		jest.mock('mock-parser-file', () => ({ name: 'mock-name', xmlTag: 'mock-xml-tag' }), {
			virtual: true
		})

		// mock a list of parser files to load
		utils.getAllOboNodeScriptPathsByType.mockReturnValueOnce(['mock-parser-file'])

		// load script to test
		const nameTransformer = require('../../src/name-transformer')

		// mock a node
		const mockNode = {
			name: 'mock-name',
			type: 'element',
			elements: [
				{
					name: 'mock-name',
					type: 'element'
				}
			]
		}

		// execute
		nameTransformer(mockNode)

		// verify name has been updated
		expect(mockNode).toHaveProperty('name', 'mock-xml-tag')

		// verify recursive name update
		expect(mockNode.elements[0]).toHaveProperty('name', 'mock-xml-tag')
	})
})
