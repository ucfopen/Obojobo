import React from 'react'
import { Editor, Node, Transforms, Text } from 'slate'

import EditorComponent from './editor-component'
import Converter from './converter'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Page = {
	name: PAGE_NODE,
	menuLabel: 'Page',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a Page node, make sure it has Obonode children
			if (node.type === PAGE_NODE) {
				// Code child normalization
				for (const [child, childPath] of Node.children(editor, path)) {
					// Wrap text childen in a score node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor,
							{
								type: TEXT_NODE,
								content: {}
							},
							{ at: childPath }
						)
						return
					}
				}

				// Page parent normalization
				const [parent] = Editor.parent(editor, path)
				if (!parent || parent.type === PAGE_NODE) {
					Transforms.unwrapNodes(editor, { at: path })
					return
				}
			}

			next(entry, editor)
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	},
	getNavItem(model) {
		let label

		if (model.title) {
			label = '' + model.title
		} else if (model.parent) {
			const pages = model.parent.children.models.filter(
				child => child.get('type') === 'ObojoboDraft.Pages.Page'
			)
			label = `Page ${pages.indexOf(model) + 1}`
		} else {
			label = `Page`
		}

		return {
			type: 'link',
			label,
			path: [label.toLowerCase().replace(/ /g, '-')],
			showChildren: false
		}
	}
}

export default Page
