import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Test from '../../../../../../ObojoboDraft/Sections/Assessment/components/test/index'

describe('Test', () => {
	test('Test component', () => {
		let model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		let moduleData = {
			focusState: {}
		}

		let component = renderer.create(<Test model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component with completeAttempt', () => {
		let model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		let moduleData = {
			focusState: {}
		}

		let component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component fetching score', () => {
		let model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		let moduleData = {
			focusState: {}
		}

		let component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} isFetching={true} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
