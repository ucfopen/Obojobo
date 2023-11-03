const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')

const assessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'scoreActions', 'rubric', 'actions'])
	const scoreActionsXML = scoreActionsParser(node.content.scoreActions, childrenParser)
	const rubricXML = rubricParser(node.content.rubric)
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<Assessment${attrs}${id}>` +
		childrenParser(node.children) +
		scoreActionsXML +
		rubricXML +
		triggersXML +
		objectivesXML +
		varsXML +
		`</Assessment>`
	)
}

const scoreActionsParser = (scoreActions, childrenParser) => {
	if (!scoreActions) return ''

	let scoreActionsBodyXML = ''
	scoreActions.forEach(scoreAction => {
		const attrs = processAttrs(scoreAction, ['page'])

		scoreActionsBodyXML +=
			`<scoreAction${attrs}>` + childrenParser([scoreAction.page]) + `</scoreAction>`
	})

	return `<scoreActions>` + scoreActionsBodyXML + `</scoreActions>`
}

const rubricParser = rubric => {
	if (!rubric) return ''

	let modsXML = ''
	if (rubric.mods) {
		let modsBodyXML = ''
		rubric.mods.forEach(mod => {
			const attrs = processAttrs(mod, [])
			modsBodyXML += `<mod${attrs} />`
		})

		modsXML = !modsBodyXML ? '' : `<mods>` + modsBodyXML + `</mods>`
	}

	const attrs = processAttrs(rubric, ['mods'])

	return `<rubric${attrs}>` + modsXML + `</rubric>`
}

module.exports = assessmentNodeParser
