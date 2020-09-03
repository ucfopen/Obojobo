import React from 'react'
import Loading from './loading'
import { create } from 'react-test-renderer'

describe('Loading', () => {
	test('renders correctly with default props', () => {
		const mockChildren = ['child1', 'child2']
		const component = create(<Loading>{mockChildren}</Loading>)

		const loadingChildren = component.root.children
		expect(loadingChildren.length).toBe(2)
		expect(loadingChildren[0]).toBe('child1')
		expect(loadingChildren[1]).toBe('child2')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with standard props provided', () => {
		const mockChildren = ['child1', 'child2']
		const component = create(
			<Loading isLoading={true} loadingText="different loading text">
				{mockChildren}
			</Loading>
		)

		const loadingChildren = component.root.children
		expect(loadingChildren.length).toBe(1)
		expect(loadingChildren[0].children.length).toBe(1)
		expect(loadingChildren[0].children[0]).toBe('different loading text')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with some props provided', () => {
		const component = create(<Loading isLoading={true}>{'children'}</Loading>)

		const loadingChildren = component.root.children
		expect(loadingChildren.length).toBe(1)
		expect(loadingChildren[0].children.length).toBe(1)
		expect(loadingChildren[0].children[0]).toBe('Loading...')

		expect(component.toJSON()).toMatchSnapshot()
	})
})
