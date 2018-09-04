import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import TextGroupEl from '../../../../src/scripts/common/chunk/text-chunk/text-group-el'
import TextGroup from '../../../../src/scripts/common/text-group/text-group'
import StyleableText from '../../../../src/scripts/common/text/styleable-text'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../../src/scripts/common/flux/dispatcher')

describe('TextGroupEl', () => {
	let tg

	beforeEach(() => {
		tg = TextGroup.create()
		tg.clear()

		// first item, no formatting:
		tg.add(new StyleableText('First line'))

		// second item, some formatting and a variable:
		const st = new StyleableText('Some BOLD text with a {{variable}} included')
		st.styleText('b', 5, 9)
		tg.add(st)
	})

	test('TextGroupEl unformatted', () => {
		const component = renderer.create(<TextGroupEl groupIndex={0} textItem={tg.get(0)} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('TextGroupEl formatted', () => {
		const component = renderer.create(<TextGroupEl groupIndex={1} textItem={tg.get(1)} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Renders text', () => {
		const component = mount(
			<TextGroupEl groupIndex={0} textItem={tg.get(0)} parentModel={jest.fn()} />
		)

		expect(component.text()).toBe('First line')
	})

	test('Variable replacement', () => {
		Dispatcher.trigger.mockImplementationOnce((eventName, event, variable) => {
			event.text = 'REPLACE(' + variable + ')'
		})

		const component = mount(
			<TextGroupEl groupIndex={1} textItem={tg.get(1)} parentModel={jest.fn()} />
		)

		expect(component.text()).toBe('Some BOLD text with a REPLACE(variable) included')
	})

	test('Variable replacement with no match', () => {
		Dispatcher.trigger.mockImplementationOnce((eventName, event) => {
			event.text = null
		})

		const component = mount(
			<TextGroupEl groupIndex={1} textItem={tg.get(1)} parentModel={jest.fn()} />
		)

		expect(component.text()).toBe('Some BOLD text with a variable included')
	})
})
