import TextParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

const slateToObo = node => {
	const json = {
		type: 'pass-fail',
		mods: []
	}

	node.nodes.forEach(parameter => {
		if (parameter.type === MOD_LIST_NODE) {
			parameter.nodes.forEach(mod => {
				const oboMod = {
					attemptCondition: mod.nodes.get(0).text,
					reward: mod.nodes.get(1).text
				}

				json.mods.push(oboMod)
			})
		} else if (parameter.text !== '') {
			json[parameter.data.get('name')] = parameter.text
		}
	})

	if (json.mods.length === 0) delete json.mods

	return json
}

const oboToSlate = node => {
	const nodes = [
		TextParameter.helpers.oboToSlate(
			'passingAttemptScore',
			node.passingAttemptScore,
			'Passing Score'
		),
		TextParameter.helpers.oboToSlate('passedResult', node.passedResult, 'Passed Result'),
		TextParameter.helpers.oboToSlate('failedResult', node.failedResult, 'Failed Result'),
		TextParameter.helpers.oboToSlate(
			'unableToPassResult',
			node.unableToPassResult,
			'Unable to Pass Result'
		)
	]

	if (node.mods) {
		const modList = {
			object: 'block',
			type: MOD_LIST_NODE,
			nodes: []
		}

		node.mods.forEach(mod => {
			const slateMod = {
				object: 'block',
				type: MOD_NODE,
				nodes: []
			}

			slateMod.nodes.push(
				TextParameter.helpers.oboToSlate(
					'attemptCondition',
					mod.attemptCondition,
					'Attempt Condition'
				)
			)
			slateMod.nodes.push(TextParameter.helpers.oboToSlate('reward', mod.reward, 'Reward'))

			modList.nodes.push(slateMod)
		})

		nodes.push(modList)
	}

	return {
		object: 'block',
		type: RUBRIC_NODE,
		data: { content: node },
		nodes
	}
}

export default { slateToObo, oboToSlate }
