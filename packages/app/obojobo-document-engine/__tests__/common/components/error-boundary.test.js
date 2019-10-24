import React from 'react'
import ErrorBoundary from '../../../src/scripts/common/components/error-boundary'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('ErrorBoundary', () => {
	test('ErrorBoundary component', () => {
		const component = renderer.create(
			<ErrorBoundary>
				<h1>Mock Content</h1>
			</ErrorBoundary>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('ErrorBoundary handles error child component', () => {
		function ProblemChild() {
			throw new Error('Mock Error')
		}

		const component = mount(
			<ErrorBoundary>
				<ProblemChild />
			</ErrorBoundary>
		)
		component.instance().componentDidCatch({}, {})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})
})
