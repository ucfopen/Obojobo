import { mount, shallow } from 'enzyme'
import React from 'react'

import ParagraphStyles from '../../../../src/scripts/oboeditor/components/toolbars/paragraph-styles'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'

jest.useFakeTimers()

describe('Paragraph Styles', () => {
	test('Paragraph Styles node', () => {
		const value = {
			blocks: {
				reduce: fn => {
					fn('Heading', { type: 'Heading' })
					fn('Heading', { type: 'Text' })
					return CODE_LINE_NODE
				},
				get: () => ({ type: 'Heading' })
			}
		}
		const component = shallow(<ParagraphStyles value={value} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Paragraph Styles node opens and closes', () => {
		const value = {
			blocks: {
				reduce: () => TEXT_LINE_NODE,
				get: () => ({ type: 'Heading' })
			}
		}
		const component = mount(<ParagraphStyles value={value} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('Paragraph Styles calls editor.changeToType', () => {
		const editor = {
			current: {
				changeToType: jest.fn()
			}
		}
		const value = {
			blocks: {
				reduce: () => TEXT_LINE_NODE,
				get: () => ({ type: 'Heading' })
			}
		}
		const component = mount(<ParagraphStyles value={value} editor={editor} />)

		component
			.find('button')
			.at(1)
			.simulate('click')
		component
			.find('button')
			.at(2)
			.simulate('click')
		component
			.find('button')
			.at(3)
			.simulate('click')
		component
			.find('button')
			.at(4)
			.simulate('click')
		component
			.find('button')
			.at(5)
			.simulate('click')
		component
			.find('button')
			.at(6)
			.simulate('click')
		component
			.find('button')
			.at(7)
			.simulate('click')
		component
			.find('button')
			.at(8)
			.simulate('click')

		expect(editor.current.changeToType).toHaveBeenCalledTimes(8)
	})

	test('Paragraph Styles component opens and closes menu with keys', () => {
		const value = {
			blocks: {
				reduce: () => CODE_NODE,
				get: () => ({ type: 'Heading' })
			}
		}
		const component = mount(<ParagraphStyles value={value} />)

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowRight',
				stopPropagation: jest.fn()
			})

		expect(component.html()).toMatchSnapshot()

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowLeft',
				stopPropagation: jest.fn()
			})

		expect(component.html()).toMatchSnapshot()
	})

	test('Paragraph Styles component moves up and down with keys', () => {
		const value = {
			blocks: {
				reduce: () => CODE_NODE,
				get: () => ({ type: 'Heading' })
			}
		}
		const component = shallow(<ParagraphStyles value={value} />)

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowUp',
				stopPropagation: jest.fn()
			})

		expect(component.state()).toMatchSnapshot()

		component
			.find('div')
			.at(0)
			.simulate('keyDown', {
				key: 'ArrowDown',
				stopPropagation: jest.fn()
			})

		expect(component.state()).toMatchSnapshot()
	})

	test('Paragraph Styles component closes menu when unfocused', () => {
		const value = {
			blocks: {
				reduce: (fn, first) => {
					fn(0, { type: 'Heading', data: { get: () => ({ level: 1 }) } })
					fn(1, { type: 'Heading', data: { get: () => ({ level: 1 }) } })
					return first
				},
				get: () => ({ type: HEADING_NODE, data: { get: () => ({ level: 1 }) } })
			}
		}
		const component = shallow(<ParagraphStyles value={value} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('Paragraph Styles component cancels menu closure when focused', () => {
		const value = {
			blocks: {
				reduce: (fn, first) => first,
				get: () => ({ type: HEADING_NODE, data: { get: () => ({ level: null }) } })
			}
		}
		const component = shallow(<ParagraphStyles value={value} />)

		const html = component
			.find('div')
			.at(0)
			.simulate('focus')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})
})
