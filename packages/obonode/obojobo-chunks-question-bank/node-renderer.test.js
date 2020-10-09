import { mount } from 'enzyme'
import NodeRenderer from './node-renderer'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

describe('NodeRenderer', () => {
	test('NodeRenderer displays Elements', () => {
		const component = mount(<NodeRenderer value={[]} />)
		expect(
			component.instance().renderElement({
				element: {
					type: 'a',
					href: 'mockLink',
					children: [{ text: '' }]
				},
				children: ''
			})
		).toMatchInlineSnapshot(`
		<SlateWrapper
		  element={
		    Object {
		      "children": Array [
		        Object {
		          "text": "",
		        },
		      ],
		      "href": "mockLink",
		      "type": "a",
		    }
		  }
		>
		  
		</SlateWrapper>
	`)

		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue(null)
		expect(
			component.instance().renderElement({
				element: {
					type: 'unknowtype',
					href: 'mockLink',
					children: [{ text: '' }]
				},
				children: ''
			})
		).toBeUndefined()

		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			plugins: {
				renderNode: () => <p>Mock Content</p> //eslint-disable-line react/display-name
			}
		})
		expect(
			component.instance().renderElement({
				element: {
					type: 'mock Element',
					href: 'mockLink',
					children: [{ text: '' }]
				},
				children: ''
			})
		).toMatchInlineSnapshot(`
		<p>
		  Mock Content
		</p>
  `)
	})

	test('NodeRenderer displays Leaf', () => {
		const component = mount(<NodeRenderer value={[]} />)

		const mockLeaf = {
			children: <span>child</span>,
			leaf: { b: true }
		}
		expect(component.instance().renderLeaf(mockLeaf)).toMatchInlineSnapshot(`
		<span>
		  <strong>
		    <span>
		      child
		    </span>
		  </strong>
		</span>
	`)
	})
})
