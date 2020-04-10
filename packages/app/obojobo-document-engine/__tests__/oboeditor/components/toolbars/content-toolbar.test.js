import { shallow } from 'enzyme'
import React from 'react'

import ContentToolbar from '../../../../src/scripts/oboeditor/components/toolbars/content-toolbar'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

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
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.toggleMark).toHaveBeenCalled()
	})
})
