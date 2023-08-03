import { mount } from 'enzyme'
import React from 'react'

jest.mock('slate-react')
import { useEditor } from 'slate-react'
import FormatMenu from './format-menu'

const LIST_NODE = 'ObojoboDraft.Chunks.List'

describe('FormatMenu', () => {
	beforeEach(() => {
		useEditor.mockReturnValue({
			current: {},
			toggleMark: jest.fn(),
			setAlign: jest.fn(),
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
			unindentList: jest.fn(),
			changeToType: jest.fn()
		})
	})
	test('component snapshot', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 1 } }
		}

		const component = mount(<FormatMenu value={value} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('toggles mark', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu value={value} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(useEditor().toggleMark).toHaveBeenCalled()
	})

	test('calls editor.changeToType for each paragraph style', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu value={value} />)

		const buttonMap = {
			12: 'Normal Text',
			13: 'Heading 1',
			14: 'Heading 2',
			15: 'Heading 3',
			16: 'Heading 4',
			17: 'Heading 5',
			18: 'Heading 6',
			19: 'Code'
		}

		for (const id in buttonMap) {
			const editor = useEditor()
			editor.changeToType.mockClear()

			const target = component.find('button').at(id)
			expect(target.props().children[0]).toBe(buttonMap[id])
			target.simulate('click')

			expect(editor.changeToType).toHaveBeenCalledTimes(1)
		}
	})

	test('calls editor.changeToType for each align style', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu value={value} />)

		const buttonMap = {
			21: 'Left Align',
			22: 'Center Align',
			23: 'Right Align'
		}

		for (const id in buttonMap) {
			const editor = useEditor()
			editor.setAlign.mockClear()

			const target = component.find('button').at(id)
			expect(target.props().children[0]).toBe(buttonMap[id])
			target.simulate('click')

			expect(editor.setAlign).toHaveBeenCalledTimes(1)
		}
	})

	test('sets indent', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu value={value} />)

		component
			.find('button')
			.at(26)
			.simulate('click')

		expect(useEditor().unindentList).toHaveBeenCalled()
	})

	test.skip('calls editor.changeToType for each bullet style', () => {
		const value = {
			selection: { focus: { key: 'mock-key', offset: 1 }, anchor: { key: 'mock-key', offset: 4 } }
		}

		const component = mount(<FormatMenu value={value} />)

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

		expect(useEditor().changeToType).toHaveBeenCalledTimes(8)
	})
})
