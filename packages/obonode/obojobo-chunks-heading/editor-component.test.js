import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Heading from './editor-component'

describe('Heading Editor Node', () => {
	test('Heading component', () => {
		const component = renderer.create(
			<Heading
				node={{
					data: {
						get: () => ({})
					},
					text: ''
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Heading component mounts and unmounts properly', () => {
		jest.spyOn(document, 'addEventListener')
		const component = mount(
			<Heading
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => ({})
					},
					text: 'Your Title Goes Here'
				}}
			/>
		)
		const tree = component.html()

		component.unmount()

		expect(tree).toMatchSnapshot()
	})

	test('Heading component toggles level select', () => {
		const component = mount(
			<Heading
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => ({})
					},
					text: 'Your Title Here'
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Heading component handles clicks', () => {
		const component = mount(
			<Heading
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => ({})
					},
					text: 'Your Title Here'
				}}
			/>
		)

		const nodeInstance = component.instance()
		nodeInstance.node = {
			contains: value => value
		}

		nodeInstance.handleClick({ target: true }) // click inside

		let tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.handleClick({ target: false }) // click outside

		tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node = null
		nodeInstance.handleClick() // click without node

		tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Heading component edits heading level', () => {
		const component = mount(
			<Heading
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => ({})
					},
					text: 'Your Title Here'
				}}
				editor={{
					setNodeByKey: jest.fn()
				}}
			/>
		)

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 1
		component
			.find('button')
			.at(1)
			.simulate('click')

		let tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 2
		component
			.find('button')
			.at(2)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 3
		component
			.find('button')
			.at(3)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 4
		component
			.find('button')
			.at(4)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 5
		component
			.find('button')
			.at(5)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 6
		component
			.find('button')
			.at(6)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
