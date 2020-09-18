import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './editor-icon.svg'
import EditorComponent from './editor-component'
import Converter from './converter'

const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

const YouTube = {
	name: YOUTUBE_NODE,
	menuLabel: 'YouTube',
	icon: Icon,
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		isVoid(element, editor, next) {
			if (element.type === YOUTUBE_NODE) return true

			return next(element)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default YouTube
