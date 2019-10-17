import React from 'react'
import renderer from 'react-test-renderer'

import NumericHeader from './numeric-header'

describe('NumericHeader', () => {
	test('NumericHeader renders with requirement of `exact`', () => {
		const component = renderer.create(<NumericHeader requirement="exact" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericHeader renders with requirement of `range`', () => {
		const component = renderer.create(<NumericHeader requirement="range" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericHeader renders with requirement of `margin`', () => {
		const component = renderer.create(<NumericHeader requirement="margin" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericHeader renders with requirement of `precise`', () => {
		const component = renderer.create(<NumericHeader requirement="precise" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericHeader renders with default requirement', () => {
		const component = renderer.create(<NumericHeader requirement="" />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
