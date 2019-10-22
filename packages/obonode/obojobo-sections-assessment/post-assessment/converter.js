import Common from 'obojobo-document-engine/src/scripts/common'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'

const slateToObo = node => {
	const Page = Common.Registry.getItemForType(PAGE_NODE)
	const json = []

	node.nodes.forEach(action => {
		const slateAction = {
			for: action.data.get('for')
		}

		action.nodes.forEach(page => {
			slateAction.page = Page.slateToObo(page)
		})

		json.push(slateAction)
	})

	return json
}

const oboToSlate = node => {
	const Page = Common.Registry.getItemForType(PAGE_NODE)
	const json = {}
	json.object = 'block'
	json.type = ACTIONS_NODE
	json.nodes = []
	node.forEach(action => {
		const slateAction = {
			object: 'block',
			type: SCORE_NODE,
			data: { for: action.for },
			nodes: []
		}

		slateAction.nodes.push(Page.oboToSlate(action.page))

		json.nodes.push(slateAction)
	})

	return json
}

export default { slateToObo, oboToSlate }
