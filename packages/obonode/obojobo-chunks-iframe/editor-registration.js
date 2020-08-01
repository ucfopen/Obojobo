import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'
import { Element, Editor, Node } from 'slate'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

const IFrame = {
	name: IFRAME_NODE,
	menuLabel: 'IFrame',
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
						placeholder: 'Type an IFrame caption here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default IFrame
