import { mount, shallow } from 'enzyme'
import React from 'react'

import ParagraphStyles from '../../../../src/scripts/oboeditor/components/toolbars/paragraph-styles'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.Line'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.Line'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'

jest.useFakeTimers()

describe('Paragraph Styles', () => {
	test('Paragraph Styles node', () => {
		const value = { blocks: {
			reduce: fn => {
				fn("Heading", { type: "Heading" })
				fn("Heading", { type: "Text" })
				return CODE_LINE_NODE
			},
			get: () => ({ type: "Heading" })
		}}
		const component = shallow(<ParagraphStyles value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Paragraph Styles node opens and closes', () => {
		const value = { blocks: {
			reduce: () => CODE_NODE,
			get: () => ({ type: "Heading" })
		}}
		const component = mount(<ParagraphStyles value={value}/>)
		
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

	test('Paragraph Styles component opens and closes menu with keys', () => {
		const value = { blocks: {
			reduce: () => CODE_NODE,
			get: () => ({ type: "Heading" })
		}}
		const component = mount(<ParagraphStyles value={value}/>)

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
		const value = { blocks: {
			reduce: () => CODE_NODE,
			get: () => ({ type: "Heading" })
		}}
		const component = shallow(<ParagraphStyles value={value}/>)

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
		const value = { blocks: {
			reduce: () => CODE_NODE,
			get: () => ({ type: "Heading" })
		}}
		const component = shallow(<ParagraphStyles value={value}/>)

		const html = component
			.find('div')
			.at(0)
			.simulate('blur')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})

	test('Paragraph Styles component cancels menu closure when focused', () => {
		const value = { blocks: {
			reduce: () => CODE_NODE,
			get: () => ({ type: "Heading" })
		}}
		const component = shallow(<ParagraphStyles value={value}/>)

		const html = component
			.find('div')
			.at(0)
			.simulate('focus')
			.html()

		jest.runAllTimers()

		expect(html).toMatchSnapshot()
	})
})