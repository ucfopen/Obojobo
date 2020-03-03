import Common from 'obojobo-document-engine/src/scripts/common'

const slateToObo = node => Common.Registry.getItemForType(node.type).slateToObo(node)

const oboToSlate = node => {
	const editorModel = Common.Registry.getItemForType(node.type)
	if (editorModel && !editorModel.ignore) {
		return editorModel.oboToSlate(node)
	}
}

export default { slateToObo, oboToSlate }
