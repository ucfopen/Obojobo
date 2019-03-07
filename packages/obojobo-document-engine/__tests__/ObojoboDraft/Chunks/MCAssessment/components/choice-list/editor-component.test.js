import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ChoiceList from 'ObojoboDraft/Chunks/MCAssessment/components/choice-list/editor-component'

describe('ChoiceList Editor Node', () => {
	test('ChoiceList builds the expected component', () => {
		const component = renderer.create(
			<ChoiceList
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ChoiceList component adds choice', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<ChoiceList
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
