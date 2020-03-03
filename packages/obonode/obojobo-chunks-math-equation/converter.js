import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: [],
	content: withoutUndefined(node.data.get('content') || {})
})

const oboToSlate = node => ({
	object: 'block',
	key: node.id,
	type: node.type,
	isVoid: true,
	data: { content: node.content }
})

export default { slateToObo, oboToSlate }
