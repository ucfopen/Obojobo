import React from 'react'
import renderer from 'react-test-renderer'
import Flag from '../../../src/scripts/viewer/components/flag'

describe('Flag', () => {
	test('Renders CHOSEN_CORRECTLY', () => {
		const component = renderer.create(<Flag type={Flag.CHOSEN_CORRECTLY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders CHOSEN_SURVEY', () => {
		const component = renderer.create(<Flag type={Flag.CHOSEN_SURVEY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders SHOULD_NOT_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.SHOULD_NOT_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders COULD_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.COULD_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders SHOULD_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.SHOULD_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders UNCHOSEN_CORRECTLY', () => {
		const component = renderer.create(<Flag type={Flag.UNCHOSEN_CORRECTLY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders unexpected flag value', () => {
		const component = renderer.create(<Flag type={'someInvalidType'} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
