const variableParser = require('../../src/variables-parser')

describe('Variable parser', () => {
	// there are two other internal methods that we can't test independently
	// it is what it is
	test('parses variables from an element', () => {
		// we happen to know the typical structure so this is a little magical
		const mockElement = {
			elements: [
				{
					name: 'var',
					attributes: {
						attr1: 'wat',
						attr2: 'destiny'
					}
				}
			]
		}
		expect(variableParser(mockElement)).toEqual([
			{
				attr1: 'wat',
				attr2: 'destiny'
			}
		])
	})
})
