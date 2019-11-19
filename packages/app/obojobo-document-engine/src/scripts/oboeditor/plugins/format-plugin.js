import Common from 'obojobo-document-engine/src/scripts/common'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const FormatPlugin = {
	commands: {
		changeToText: editor => {
			editor.value.fragment.nodes.forEach(node => {
				const item = Common.Registry.getItemForType(node.type)

				if(item.switchType[TEXT_NODE]) {
					item.switchType[TEXT_NODE](editor, node)
				}
			})
		}
	}
}

export default FormatPlugin
