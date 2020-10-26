import { Transforms } from 'slate'

const splitParent = (entry, editor, event) => {
	if (event.isDefaultPrevented()) return
	event.preventDefault()

	Transforms.splitNodes(editor, { at: editor.selection })
}

export default splitParent
