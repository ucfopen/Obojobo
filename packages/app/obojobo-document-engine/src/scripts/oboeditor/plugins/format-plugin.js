import Common from 'obojobo-document-engine/src/scripts/common'

const FormatPlugin = {
	commands: {
		changeToText: editor => {
			editor.value.fragment.nodes.forEach(node => {
				console.log(node)
				const item = Common.Registry.getItemForType(node.type)
				console.log(item)
				console.log(item.switchType)
			})
		}
	}
}

export default FormatPlugin
