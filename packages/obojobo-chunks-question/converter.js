import Common from 'obojobo-document-engine/src/scripts/common/index'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'

const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	delete json.content.solution

	node.nodes.forEach(child => {
		if (child.type === SOLUTION_NODE) {
			json.content.solution = Common.Registry.getItemForType(PAGE_NODE).slateToObo(child.nodes.get(0))
		} else if (child.type === MCASSESSMENT_NODE) {
			json.children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
		} else {
			json.children.push(Component.helpers.slateToObo(child))
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }
	json.nodes = []

	node.children.forEach(child => {
		if (child.type === MCASSESSMENT_NODE) {
			json.nodes.push(Common.Registry.getItemForType(child.type).oboToSlate(child))
		}
		json.nodes.push(Component.helpers.oboToSlate(child))
	})

	if (json.data.content.solution) {
		const solution = {
			object: 'block',
			type: SOLUTION_NODE,
			nodes: []
		}

		solution.nodes.push(
			Common.Registry.getItemForType(PAGE_NODE).oboToSlate(json.data.content.solution)
		)
		json.nodes.push(solution)
	}

	return json
}

export default { slateToObo, oboToSlate }
