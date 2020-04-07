import Common from 'obojobo-document-engine/src/scripts/common'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const { OboModel } = Common.models

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

/**
 * Generates an Obojobo Assessment Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components, and converts
 * any rubric and score action children back into attributes
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Assessment node 
 */
const slateToObo = node => {
	let Page
	let QuestionBank
	let Rubric
	let ScoreActions
	// Mix the model.content and the node.content to make sure that
	// all settings are properly preserved
	const model = OboModel.models[node.id]
	const content = model
		? { ...node.content, ...model.get('content') }
		: node.content

	// Remove rubric if it has been deleted
	delete content.rubric

	const children = []
	node.children.forEach(child => {
		switch (child.type) {
			case PAGE_NODE:
				Page = Common.Registry.getItemForType(PAGE_NODE)
				children.push(Page.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
				children.push(QuestionBank.slateToObo(child))
				break
			case ACTIONS_NODE:
				ScoreActions = Common.Registry.getItemForType(ACTIONS_NODE)
				content.scoreActions = ScoreActions.slateToObo(child)
				break
			case RUBRIC_NODE:
				Rubric = Common.Registry.getItemForType(RUBRIC_NODE)
				content.rubric = Rubric.slateToObo(child)
				break
		}
	})

	return {
		id: node.id,
		type: node.type,
		content: withoutUndefined(content),
		children
	}
}

/**
 * Generates a Slate node from an Obojobo Assessment node.
 * Copies all attributes, and calls the appropriate converters for the children.
 * It also converts the rubric and the score actions into Slate nodes for easy
 * editing.
 * @param {Object} node An Obojobo Assessment node 
 * @returns {Object} A Slate node
 */
const oboToSlate = model => {
	const node = model.attributes
	const slateNode = Object.assign({}, node)

	slateNode.children = node.children.map(child => {
		if (child.type === PAGE_NODE) {
			const Page = Common.Registry.getItemForType(PAGE_NODE)
			return Page.oboToSlate(child)
		} else {
			const QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
			return QuestionBank.oboToSlate(child)
		}
	})

	const ScoreActions = Common.Registry.getItemForType(ACTIONS_NODE)
	slateNode.children.push(ScoreActions.oboToSlate(node.content.scoreActions))

	const Rubric = Common.Registry.getItemForType(RUBRIC_NODE)
	if (node.content.rubric) {
		node.content.rubric.attempts = node.content.attempts
		slateNode.children.push(Rubric.oboToSlate(node.content.rubric))
	} else {
		// Although highest rubrics do not use the rubric properties,
		// setting them allows the defaults to be avalible if/when a user switches to pass-fail
		slateNode.children.push(
			Rubric.oboToSlate({
				type: 'highest',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: null,
				mods: []
			})
		)
	}

	return slateNode
}

export default { slateToObo, oboToSlate }
