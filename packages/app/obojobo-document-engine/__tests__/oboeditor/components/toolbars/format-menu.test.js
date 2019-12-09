import { mount } from 'enzyme'
import React from 'react'

import FormatMenu from '../../../../src/scripts/oboeditor/components/toolbars/format-menu'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('Format Menu', () => {
	test('FormatMenu node', () => {
		const editor = { current: {
		}}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 1} }
		}

		const component = mount(<FormatMenu editor={editor} value={value}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FormatMenu node toggles mark', () => {
		const editor = { current: {
			focus: jest.fn()
		}}
		editor.current.toggleMark = jest.fn().mockReturnValue(editor.current)
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 4} }
		}

		const component = mount(<FormatMenu editor={editor} value={value}/>)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.current.toggleMark).toHaveBeenCalled()
	})

	test('FormatMenu node calls editor.changeToType for each paraggraph style', () => {
		const editor = { current: {
			changeToType: jest.fn()
		}}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 4} }
		}

		const component = mount(<FormatMenu editor={editor} value={value}/>)

		component
			.find('button')
			.at(12)
			.simulate('click')
		component
			.find('button')
			.at(13)
			.simulate('click')
		component
			.find('button')
			.at(14)
			.simulate('click')
		component
			.find('button')
			.at(15)
			.simulate('click')
		component
			.find('button')
			.at(16)
			.simulate('click')
		component
			.find('button')
			.at(17)
			.simulate('click')
		component
			.find('button')
			.at(18)
			.simulate('click')
		component
			.find('button')
			.at(19)
			.simulate('click')

		expect(editor.current.changeToType).toHaveBeenCalledTimes(8)
	})

	test('FormatMenu node sets indent', () => {
		const editor = { current: {
			value: { blocks: [{ type: LIST_LINE_NODE }]},
			unwrapNodeByKey: jest.fn(),
			unindentList: jest.fn()
		}}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 4} }
		}

		const component = mount(<FormatMenu editor={editor} value={value}/>)

		component
			.find('button')
			.at(25)
			.simulate('click')

		expect(editor.current.unindentList).toHaveBeenCalled()
	})

	test('FormatMenu node calls editor.changeToType for each bullet style', () => {
		const editor = { current: {
			changeToType: jest.fn()
		}}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1}, anchor: { key: 'mock-key', offset: 4} }
		}

		const component = mount(<FormatMenu editor={editor} value={value}/>)

		// Unordered lists
		component
			.find('button')
			.at(28)
			.simulate('click')
		component
			.find('button')
			.at(29)
			.simulate('click')
		component
			.find('button')
			.at(30)
			.simulate('click')

		// Ordered lists
		component
			.find('button')
			.at(32)
			.simulate('click')
		component
			.find('button')
			.at(33)
			.simulate('click')
		component
			.find('button')
			.at(34)
			.simulate('click')
		component
			.find('button')
			.at(35)
			.simulate('click')
		component
			.find('button')
			.at(36)
			.simulate('click')

		expect(editor.current.changeToType).toHaveBeenCalledTimes(8)
	})
})