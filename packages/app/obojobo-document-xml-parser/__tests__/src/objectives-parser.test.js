const parseObjectives = require('../../src/objectives-parser')

describe('Objectives Parser', () => {
	const el = {
		elements: [
			{
				value: null,
				attributes: { id: 'mock-id-1', label: 'mock-label-1' }
			},
			{
				value: [{ text: 'mock-text' }],
				attributes: { id: 'mock-id-2', label: 'mock-label-2' }
			}
		]
	}

	test('Correctly parses objectives', () => {
		const parsed = parseObjectives(el)

		expect(parsed[0]).toStrictEqual({
			objectiveId: el.elements[0].attributes.id
		})

		expect(parsed[1]).toStrictEqual({
			objectiveId: el.elements[1].attributes.id,
			objectiveLabel: el.elements[1].attributes.label,
			description: el.elements[1].value[0].text
		})
	})
})
