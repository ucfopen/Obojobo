import ParameterNode from '../../../../../src/scripts/oboeditor/components/parameter-node'

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
		ParameterNode.helpers.oboToSlate({
			name: 'passingAttemptScore',
			value: node.passingAttemptScore,
			display: 'Passing Score'
		}),
		ParameterNode.helpers.oboToSlate({
			name: 'passedResult',
			value: node.passedResult,
			display: 'Passed Result'
		}),
		ParameterNode.helpers.oboToSlate({
			name: 'failedResult',
			value: node.failedResult,
			display: 'Failed Result'
		}),
		ParameterNode.helpers.oboToSlate({
			name: 'unableToPassResult',
			value: node.unableToPassResult,
			display: 'Unable to Pass Result'
		})
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
				ParameterNode.helpers.oboToSlate({
					name: 'attemptCondition',
					value: mod.attemptCondition,
					display: 'Attempt Condition'
				})
			)
			slateMod.nodes.push(
				ParameterNode.helpers.oboToSlate({
					name: 'reward',
					value: mod.reward,
					display: 'Reward'
				})
			)

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
