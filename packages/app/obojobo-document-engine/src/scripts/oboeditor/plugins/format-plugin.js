import Common from 'obojobo-document-engine/src/scripts/common'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const FormatPlugin = {
	commands: {
		changeToText: editor => {
			editor.value.document.getRootBlocksAtRange(editor.value.selection).forEach(node => {
				const item = Common.Registry.getItemForType(node.type)

				if(item.switchType[TEXT_NODE]) {
					item.switchType[TEXT_NODE](editor, node)
				}
			})
		},
		changeToHeading: (editor, level) => {
			editor.value.document.getRootBlocksAtRange(editor.value.selection).forEach(node => {
				const item = Common.Registry.getItemForType(node.type)

				if(item.switchType[HEADING_NODE]) {
					item.switchType[HEADING_NODE](editor, node, level)
				}
			})
		}
	}
}

export default FormatPlugin
