import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Heading from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component', () => {
	return props => <div>{props.children}</div>
})

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
				node={{
					data: {
						get: () => ({
							level: 1
						})
					},
					text: 'Your Title Here'
				}}
				isSelected={true}
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
				node={{
					data: {
						get: () => ({
							level: 1
						})
					},
					text: 'Your Title Here'
				}}
				isSelected={true}
			/>
		)

		const nodeInstance = component.instance()
		// click inside
		nodeInstance.nodeRef = {
			current: {
				contains: () => true
			}
		}
		nodeInstance.handleClick({ target: 'mock' })
		let tree = component.html()
		expect(tree).toMatchSnapshot()

		 // click outside
		nodeInstance.nodeRef = {
			current: {
				contains: () => false
			}
		}
		nodeInstance.handleClick({ target: 'mock' })
		tree = component.html()
		expect(tree).toMatchSnapshot()

		// click without a ref
		nodeInstance.nodeRef = {
			current: null
		}
		nodeInstance.handleClick({target: 'mock'})
		tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Heading component edits heading level', () => {
		const setNodeByKey = jest.fn()
		const component = mount(
			<Heading
				node={{
					data: {
						get: () => ({
							level: 1,
							align: 'left'
						})
					},
					key: 'mock-key',
					text: 'Your Title Here'
				}}
				isSelected={true}
				editor={{
					setNodeByKey
				}}
			/>
		)

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.state()).toHaveProperty('isOpen', true)

		// toggle level 1
		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(component.state()).toHaveProperty('isOpen', false)

		let tree = component.html()
		expect(tree).toMatchSnapshot()
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 1
				}
			}
		})

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
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 2
				}
			}
		})

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
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 3
				}
			}
		})

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
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 4
				}
			}
		})

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
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 5
				}
			}
		})

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
		expect(setNodeByKey).toHaveBeenLastCalledWith('mock-key', {
			data: {
				content: {
					align: 'left',
					level: 6
				}
			}
		})
	})
})
