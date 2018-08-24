import React from 'react'
import renderer from 'react-test-renderer'

import Test from '../../../../../../ObojoboDraft/Sections/Assessment/components/test/index'

describe('Test', () => {
	test('Test component', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component with completeAttempt', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component fetching score', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} isFetching={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
