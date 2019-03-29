import React from 'react'
import renderer from 'react-test-renderer'
import Header from 'src/scripts/viewer/components/header'

describe('Header', () => {
	test('renders correctly with title, left position', () => {
		const component = renderer.create(<Header moduleTitle="Title" logoPosition="left" />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly with title, right position', () => {
		const component = renderer.create(<Header moduleTitle="Title" logoPosition="right" />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly with title, no position', () => {
		const component = renderer.create(<Header moduleTitle="Title" />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly without title, left position', () => {
		const component = renderer.create(<Header logoPosition="left" />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly without title, right position', () => {
		const component = renderer.create(<Header logoPosition="right" />)
		expect(component).toMatchSnapshot()
	})

	test('renders correctly without title, no position', () => {
		const component = renderer.create(<Header />)
		expect(component).toMatchSnapshot()
	})
})
