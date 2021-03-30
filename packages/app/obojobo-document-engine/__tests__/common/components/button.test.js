import React from 'react'
import Button from '../../../src/scripts/common/components/button'
import renderer from 'react-test-renderer'

// jest.mock('../../../src/scripts/common/util/isornot')
jest.mock('../../../src/scripts/common/page/focus')

describe('Button', () => {
	test('Renders', () => {
		const component = renderer.create(<Button className="testClassName">Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('dangerous', () => {
		const component = renderer.create(<Button isDangerous>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('altAction', () => {
		const component = renderer.create(<Button altAction>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('align', () => {
		const component = renderer.create(<Button align="left">Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('shouldPreventTab', () => {
		const component = renderer.create(<Button shouldPreventTab={true}>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('disabled', () => {
		const component = renderer.create(<Button disabled={true}>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('isSubmittable', () => {
		const component = renderer.create(<Button isSubmittable={true}>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('isSubmittable', () => {
		const component = renderer.create(<Button isSubmittable={true}>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('with value', () => {
		const component = renderer.create(<Button value='child value'>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('with null value', () => {
		const component = renderer.create(<Button value={null}>Label</Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('with empty string value', () => {
		const component = renderer.create(<Button value={''}></Button>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('focus', () => {
		const focus = require('../../../src/scripts/common/page/focus').default
		const component = renderer.create(<Button value={''}></Button>)
		expect(focus).not.toHaveBeenCalled()
		component.getInstance().focus()
		expect(focus).toHaveBeenCalled()
	})

})