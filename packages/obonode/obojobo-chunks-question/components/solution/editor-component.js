import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Button } = Common.components

const Solution = props => {
	const deleteNode = () => {
		const path = ReactEditor.findPath(props.editor, props.element)
		return Transforms.removeNodes(props.editor, { at: path })
	}

	return (
		<div className="solution-editor">
			{props.children}
			<Button className="delete-button" onClick={() => deleteNode()}>
				×
			</Button>
		</div>
	)
}

export default withSlateWrapper(Solution)
