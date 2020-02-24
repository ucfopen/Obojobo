import { Transforms } from 'slate'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const ClipboardPlugin = {
	insertData(data, editor, next) {
		// Insert Slate fragments normally
		if(data.types.includes('application/x-slate-fragment')) return next(data)

		// By default, plain text will be inserted as a Text node
		// The first and last text leaves may be split out into the node that is being 
		// pasted into - this is consistant with similar editors like Google Docs and Word
		const plainText = data.getData('text/plain')
		const fragment = [{
			type: TEXT_NODE,
			content: {},
			children: plainText.split('\n').map(text => ({
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE,
				content: { align: 'left', indent: 0 },
				children: [{ text }]
			}))
		}]

		Transforms.insertFragment(editor, fragment)
	}
}

export default ClipboardPlugin
