import React from 'react'

import EditorComponent from './editor-component'
import Converter from './converter'

const NUMERIC_ANSWER_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer'

const NumericAnswer = {
	name: NUMERIC_ANSWER_NODE,
	menuLabel: 'Numeric Answer',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default NumericAnswer
