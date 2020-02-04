import Common from 'obojobo-document-engine/src/scripts/common'

const FormatPlugin = {
	commands: {
		changeToType: (editor, type, data) => {
			editor.value.document.getRootBlocksAtRange(editor.value.selection).forEach(node => {
				const item = Common.Registry.getItemForType(node.type)

				if (item.switchType[type]) {
					item.switchType[type](editor, node, data)
				}
			})
		}
	}
}

export default FormatPlugin
