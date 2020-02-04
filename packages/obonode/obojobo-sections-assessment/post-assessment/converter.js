import Common from 'obojobo-document-engine/src/scripts/common'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'

const slateToObo = node => {
	const Page = Common.Registry.getItemForType(PAGE_NODE)
	const json = []

	node.children.forEach(action => {
		const slateAction = {
			for: action.content.for
		}

		action.children.forEach(page => {
			slateAction.page = Page.slateToObo(page)
		})

		json.push(slateAction)
	})

	return json
}

const oboToSlate = node => {
	const Page = Common.Registry.getItemForType(PAGE_NODE)
	const json = {
		type: ACTIONS_NODE,
		children: []
	}

	node.forEach(action => {
		const slateAction = {
			type: ACTIONS_NODE,
			subtype: SCORE_NODE,
			content: { for: action.for },
			children: []
		}

		slateAction.children.push(Page.oboToSlate(action.page))

		json.children.push(slateAction)
	})

	return json
}

export default { slateToObo, oboToSlate }
