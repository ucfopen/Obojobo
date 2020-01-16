import React from 'react'
import { Element, Editor, Node } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const Heading = {
	name: HEADING_NODE,
	menuLabel: 'Heading',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		decorate([node, path], editor) {
			// Define a placeholder decoration
			if(Element.isElement(node) && Node.string(node) === ''){
				const point = Editor.start(editor, path)

				return [{
					placeholder: 'Type your heading here',
					anchor: point,
					focus: point
				}]
			}

			return []
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	},
	getNavItem(model) {
		switch (model.modelState.headingLevel) {
			case 1:
			case 2:
				if (model.modelState.headingLevel === 1 && model.getIndex() === 0) {
					return null
				}

				return {
					type: 'sub-link',
					label: model.modelState.textGroup.first.text,
					path: [
						model
							.toText()
							.toLowerCase()
							.replace(/ /g, '-')
					],
					showChildren: false
				}

			default:
				return null
		}
	}
}

export default Heading
