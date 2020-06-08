import React from 'react'
import { useEditor, useSelected, ReactEditor } from 'slate-react'
import { Range } from 'slate'

const withSlateWrapper = WrappedComponent => {
	const SlateWrapper = props => {
		const selected = useSelected()
		const editor = useEditor()

		return <WrappedComponent {...props} selected={selected} editor={editor} />
	}
	return SlateWrapper
}

export default withSlateWrapper
