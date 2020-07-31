import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'
import { Element, Editor, Node } from 'slate'

const MATERIA_NODE = 'ObojoboDraft.Chunks.Materia'

const Materia = {
	name: MATERIA_NODE,
	menuLabel: 'Materia Widget',
	icon: Icon,
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		decorate([node, path], editor) {
			// Define a placeholder decoration
			if (Element.isElement(node) && Node.string(node) === '') {
				const point = Editor.start(editor, path)

				return [
					{
						placeholder: 'Type a widget caption here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default Materia
