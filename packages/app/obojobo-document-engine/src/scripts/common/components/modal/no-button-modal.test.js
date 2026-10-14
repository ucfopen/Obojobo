import NoButtonModal from './no-button-modal'
import React from 'react'
import renderer from 'react-test-renderer'

describe('NoButtonModal', () => {
	test('renders', () => {
		const component = renderer.create(<NoButtonModal />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('renders with children', () => {
		const component = renderer.create(<NoButtonModal>Oh No!</NoButtonModal>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
