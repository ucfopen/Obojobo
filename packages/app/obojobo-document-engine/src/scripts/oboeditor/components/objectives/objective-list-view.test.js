import React from 'react'
import renderer from 'react-test-renderer'
import ObjectiveListView from 'src/scripts/oboeditor/components/objectives/objective-list-view'

describe('Objective List View', () => {
	test('ObjectiveListView renders correctly with given objectives', () => {
		let props = {
			objectives: [{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' }],
			globalObjectives: [
				{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' },
				{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' }
			],
			type: 'ObojoboDraft.Modules.Module'
		}

		let component = renderer.create(<ObjectiveListView {...props} />)
		expect(component.toJSON()).toMatchSnapshot()

		props = {
			objectives: [{ objectiveId: 'mock-id-1', objectiveLabel: 'mock-label-1' }],
			globalObjectives: [
				{ objectiveId: 'mock-id-2', objectiveLabel: 'mock-label-2' },
				{ objectiveId: 'mock-id-3', objectiveLabel: 'mock-label-3' }
			],
			type: 'mock-unknown-type'
		}

		component = renderer.create(<ObjectiveListView {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveListView renders correctly with no objectives', () => {
		const props = {
			objectives: null,
			globalObjectives: null,
			type: 'ObojoboDraft.Modules.Module'
		}

		const component = renderer.create(<ObjectiveListView {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ObjectiveListView renders correctly with unknown type', () => {
		const props = {
			objectives: [],
			globalObjectives: [],
			type: 'mock-unknown-type'
		}

		const component = renderer.create(<ObjectiveListView {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})
})
