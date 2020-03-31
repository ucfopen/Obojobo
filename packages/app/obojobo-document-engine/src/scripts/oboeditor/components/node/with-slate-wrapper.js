import React from 'react'
import {
	useEditor,
	useSelected,
	ReactEditor
} from 'slate-react'
import { Range } from 'slate'

const withSlateWrapper = (WrappedComponent) => {
	const SlateWrapper = props => {
		const selected = useSelected()
		const editor = useEditor()

		// Handles the case where the Slate editor has been deselected from within the node
		// This mostly happens with MoreInfoBoxes and void nodes
		const wasSelected = () => {
			const path = ReactEditor.findPath(editor, props.element)
			return editor.prevSelection &&
				Range.includes(editor.prevSelection, path)
		}

		return <WrappedComponent {...props} selected={selected || wasSelected()} editor={editor}/>
	}
	return SlateWrapper
}

export default withSlateWrapper