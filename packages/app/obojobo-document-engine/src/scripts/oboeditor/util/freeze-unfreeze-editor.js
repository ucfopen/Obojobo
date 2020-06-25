import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
// in slate 0.57.2:
// when the user clicks on a chunk that has it's own buttons
// (like iframe's properties button)
// the editor doesn't seem to know what's currently selected
// sometimes it ends up selecting multiple nodes.
// selection is then weird until the user selects/unselects nodes

// This is used to pause the editor from editing in the background
// for whatever reason it helps with selection
// Use in conjunction w/ unfreeze editor
export const freezeEditor = editor => {
	editor.toggleEditable(false)
}

// return back to the editor to let it continue on as normal
// using this SHOULD return editor selection to predictable behavior
export const unfreezeEditor = editor => {
	editor.toggleEditable(true)
	// Waits for the readOnly state to percolate before focusing
	setTimeout(() => {
		// Focusing on the input causes the editor to lose selection
		Transforms.select(editor, editor.prevSelection)
		ReactEditor.focus(editor)
	}, 200)
}
