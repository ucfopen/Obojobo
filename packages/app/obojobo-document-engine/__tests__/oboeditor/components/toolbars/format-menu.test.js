import { mount } from 'enzyme'
import React from 'react'

jest.mock('slate-react')

import FormatMenu from '../../../../src/scripts/oboeditor/components/toolbars/format-menu'

const LIST_NODE = 'ObojoboDraft.Chunks.List'

describe('Format Menu', () => {
	test('FormatMenu node', () => {
		const editor = { current: {} }
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 1 } }
		}

		const component = mount(<FormatMenu editor={editor} value={value} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FormatMenu node toggles mark', () => {
		const editor = {
			toggleMark: jest.fn()
		}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu editor={editor} value={value} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.toggleMark).toHaveBeenCalled()
	})

	test('FormatMenu node calls editor.changeToType for each paraggraph style', () => {
		const editor = {
			changeToType: jest.fn()
		}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu editor={editor} value={value} />)

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

		expect(editor.changeToType).toHaveBeenCalledTimes(8)
	})

	test('FormatMenu node sets indent', () => {
		const editor = {
			children: [
				{
					type: LIST_NODE,
					children: [{ text: 'mockText' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false,
			unindentList: jest.fn()
		}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu editor={editor} value={value} />)

		component
			.find('button')
			.at(25)
			.simulate('click')

		expect(editor.unindentList).toHaveBeenCalled()
	})

	test.skip('FormatMenu node calls editor.changeToType for each bullet style', () => {
		const editor = {
			changeToType: jest.fn()
		}
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu editor={editor} value={value} />)

		// Unordered lists
		component
			.find('button')
			.at(29)
			.simulate('click')
		component
			.find('button')
			.at(30)
			.simulate('click')
		component
			.find('button')
			.at(31)
			.simulate('click')

		// Ordered lists
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
		component
			.find('button')
			.at(37)
			.simulate('click')

		expect(editor.changeToType).toHaveBeenCalledTimes(8)
	})
})
