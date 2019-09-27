import Common from 'Common'

const slateToObo = node => Common.Registry.getItemForType(node.type).slateToObo(node)

const oboToSlate = node => {
	console.log('converting')
	const editorModel = Common.Registry.getItemForType(node.type)
	if (editorModel && !editorModel.ignore) {
		return editorModel.oboToSlate(node)
	}
}

export default { slateToObo, oboToSlate }
