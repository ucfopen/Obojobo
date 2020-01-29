import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: [],
	content: withoutUndefined({
		width: node.data.get('content').width,
		triggers: node.data.get('content').triggers
	})
})

const oboToSlate = node => {
	const content = node.content
	if (!content.width) content.width = 'normal'

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		data: {
			content: {
				width: content.width,
				triggers: content.triggers
			}
		}
	}
}

export default { slateToObo, oboToSlate }
