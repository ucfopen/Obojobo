import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => {
	const line = {
		text: { value: node.text, styleList: [] },
		data: { align: node.data.get('content').align }
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, line)
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: withoutUndefined({
			headingLevel: node.data.get('content').level,
			textGroup: [line],
			triggers: node.data.get('content').triggers
		})
	}
}

const oboToSlate = node => {
	let align
	const nodes = node.content.textGroup.map(line => {
		align = line.data ? line.data.align : 'left'
		return {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}
	})

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content: {
				align,
				level: node.content.headingLevel,
				triggers: node.content.triggers
			}
		}
	}
}

export default { slateToObo, oboToSlate }
