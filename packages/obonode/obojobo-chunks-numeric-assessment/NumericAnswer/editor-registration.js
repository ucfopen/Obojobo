import React from 'react'

import EditorComponent from './editor-component'
import Converter from './converter'
// import normalizeNode from './changes/normalize-node'

const NUMERIC_ANSWER_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer'

const NumericAnswer = {
	name: NUMERIC_ANSWER_NODE,
	menuLabel: 'Numeric Answer',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		// normalizeNode,
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default NumericAnswer
