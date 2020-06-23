import React from 'react'
import { useEditor, useSelected } from 'slate-react'

const withSlateWrapper = WrappedComponent => {
	const SlateWrapper = props => {
		const selected = useSelected()
		const editor = useEditor()

		return <WrappedComponent {...props} selected={selected} editor={editor} />
	}
	return SlateWrapper
}

export default withSlateWrapper
