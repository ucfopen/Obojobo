import { shallow } from 'enzyme'
import { Editor } from 'slate'
import React from 'react'

import ContentToolbar from './content-toolbar'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

// In order to test the case where no shortcut exists we remove the shortcut from one of the marks
// in order to hit that line of code
jest.mock('../marks/color-marks', () => {
	return {
		marks: [
			{
				name: 'Color',
				type: 'type',
				icon: 'icon',
				action: jest.fn()
			}
		]
	}
})

describe('Content Toolbar', () => {
	test('Toolbar node', () => {
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [{ text: 'mockText' }]
				}
			],
			selection: null
		}

		const component = shallow(<ContentToolbar editor={editor} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Toolbar node for Mac', () => {
		navigator.__defineGetter__('platform', () => 'Mock Mac')

		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [{ text: 'mockText' }]
				}
			],
			selection: null
		}

		const component = shallow(<ContentToolbar editor={editor} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Toolbar node calls the action for a button', () => {
		const editor = {
			children: [
				{
					type: TEXT_NODE,
					children: [{ text: 'mockText' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		editor.toggleMark = jest.fn().mockReturnValue(editor)

		const component = shallow(<ContentToolbar editor={editor} />)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})

	test.each`
		markType           | marks                     | isSelected
		${'Bold'}          | ${{}}                     | ${false}
		${'Bold'}          | ${{ b: true }}            | ${true}
		${'Bold'}          | ${{ i: true }}            | ${false}
		${'Bold'}          | ${{ del: true }}          | ${false}
		${'Bold'}          | ${{ q: true }}            | ${false}
		${'Bold'}          | ${{ monospace: true }}    | ${false}
		${'Bold'}          | ${{ _latex: true }}       | ${false}
		${'Bold'}          | ${{ a: true }}            | ${false}
		${'Bold'}          | ${{ sup: true, num: 1 }}  | ${false}
		${'Bold'}          | ${{ sup: true, num: -1 }} | ${false}
		${'Italic'}        | ${{}}                     | ${false}
		${'Italic'}        | ${{ b: true }}            | ${false}
		${'Italic'}        | ${{ i: true }}            | ${true}
		${'Italic'}        | ${{ del: true }}          | ${false}
		${'Italic'}        | ${{ q: true }}            | ${false}
		${'Italic'}        | ${{ monospace: true }}    | ${false}
		${'Italic'}        | ${{ _latex: true }}       | ${false}
		${'Italic'}        | ${{ a: true }}            | ${false}
		${'Italic'}        | ${{ sup: true, num: 1 }}  | ${false}
		${'Italic'}        | ${{ sup: true, num: -1 }} | ${false}
		${'Strikethrough'} | ${{}}                     | ${false}
		${'Strikethrough'} | ${{ b: true }}            | ${false}
		${'Strikethrough'} | ${{ i: true }}            | ${false}
		${'Strikethrough'} | ${{ del: true }}          | ${true}
		${'Strikethrough'} | ${{ q: true }}            | ${false}
		${'Strikethrough'} | ${{ monospace: true }}    | ${false}
		${'Strikethrough'} | ${{ _latex: true }}       | ${false}
		${'Strikethrough'} | ${{ a: true }}            | ${false}
		${'Strikethrough'} | ${{ sup: true, num: 1 }}  | ${false}
		${'Strikethrough'} | ${{ sup: true, num: -1 }} | ${false}
		${'Quote'}         | ${{}}                     | ${false}
		${'Quote'}         | ${{ b: true }}            | ${false}
		${'Quote'}         | ${{ i: true }}            | ${false}
		${'Quote'}         | ${{ del: true }}          | ${false}
		${'Quote'}         | ${{ q: true }}            | ${true}
		${'Quote'}         | ${{ monospace: true }}    | ${false}
		${'Quote'}         | ${{ _latex: true }}       | ${false}
		${'Quote'}         | ${{ a: true }}            | ${false}
		${'Quote'}         | ${{ sup: true, num: 1 }}  | ${false}
		${'Quote'}         | ${{ sup: true, num: -1 }} | ${false}
		${'Monospace'}     | ${{}}                     | ${false}
		${'Monospace'}     | ${{ b: true }}            | ${false}
		${'Monospace'}     | ${{ i: true }}            | ${false}
		${'Monospace'}     | ${{ del: true }}          | ${false}
		${'Monospace'}     | ${{ q: true }}            | ${false}
		${'Monospace'}     | ${{ monospace: true }}    | ${true}
		${'Monospace'}     | ${{ _latex: true }}       | ${false}
		${'Monospace'}     | ${{ a: true }}            | ${false}
		${'Monospace'}     | ${{ sup: true, num: 1 }}  | ${false}
		${'Monospace'}     | ${{ sup: true, num: -1 }} | ${false}
		${'Equation'}      | ${{}}                     | ${false}
		${'Equation'}      | ${{ b: true }}            | ${false}
		${'Equation'}      | ${{ i: true }}            | ${false}
		${'Equation'}      | ${{ del: true }}          | ${false}
		${'Equation'}      | ${{ q: true }}            | ${false}
		${'Equation'}      | ${{ monospace: true }}    | ${false}
		${'Equation'}      | ${{ _latex: true }}       | ${true}
		${'Equation'}      | ${{ a: true }}            | ${false}
		${'Equation'}      | ${{ sup: true, num: 1 }}  | ${false}
		${'Equation'}      | ${{ sup: true, num: -1 }} | ${false}
		${'Subscript'}     | ${{}}                     | ${false}
		${'Subscript'}     | ${{ b: true }}            | ${false}
		${'Subscript'}     | ${{ i: true }}            | ${false}
		${'Subscript'}     | ${{ del: true }}          | ${false}
		${'Subscript'}     | ${{ q: true }}            | ${false}
		${'Subscript'}     | ${{ monospace: true }}    | ${false}
		${'Subscript'}     | ${{ _latex: true }}       | ${false}
		${'Subscript'}     | ${{ a: true }}            | ${false}
		${'Subscript'}     | ${{ sup: true, num: 1 }}  | ${false}
		${'Subscript'}     | ${{ sup: true, num: -1 }} | ${true}
		${'Superscript'}   | ${{}}                     | ${false}
		${'Superscript'}   | ${{ b: true }}            | ${false}
		${'Superscript'}   | ${{ i: true }}            | ${false}
		${'Superscript'}   | ${{ del: true }}          | ${false}
		${'Superscript'}   | ${{ q: true }}            | ${false}
		${'Superscript'}   | ${{ monospace: true }}    | ${false}
		${'Superscript'}   | ${{ _latex: true }}       | ${false}
		${'Superscript'}   | ${{ a: true }}            | ${false}
		${'Superscript'}   | ${{ sup: true, num: 1 }}  | ${true}
		${'Superscript'}   | ${{ sup: true, num: -1 }} | ${false}
	`(
		'with markType = $markType, the marks $marks results in isSelected=$isSelected',
		({ markType, marks, isSelected }) => {
			const editor = {
				children: [
					{
						type: TEXT_NODE,
						children: [{ text: 'mockText' }]
					}
				],
				selection: null
			}

			const marksSpy = jest.spyOn(Editor, 'marks')

			marksSpy.mockReturnValue(marks)
			const component = shallow(<ContentToolbar editor={editor} />)
			const node = component.findWhere(node => node.key() === markType)

			expect(node.props().className).toBe(isSelected ? ' is-selected' : ' is-not-selected')

			marksSpy.mockRestore()
		}
	)
})
