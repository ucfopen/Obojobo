let convert = require('xml-js')

let nameTransform = require('./src/name-transformer')
let extensionTransform = require('./src/extension-transform')
let htmlTransform = require('./src/html-transform')
let draftJsonTransform = require('./src/draft-json-transform')
let attrElementToAttrItem = require('./src/attr-element-to-attr-item')
// let cdataElementToCdata = require('./src/cdata-element-to-cdata')

let parseTg = require('./src/text-group-parser')
let scoreParser = require('./src/score-action-parser')
let parseTriggers = require('./src/triggers-parser')
let parseListStyles = require('./src/list-styles-parser')
let parseAssessmentRubric = require('./src/assessment-rubric-parser')
let parseChartConfiguration = require('./src/chart-configuration-parser')
let parseScoreAction = scoreParser.parseScoreAction
let parseScoreActions = scoreParser.parseScoreActions

let parsers = {
	textGroup: parseTg,
	scoreAction: parseScoreAction,
	scoreActions: parseScoreActions,
	rubric: parseAssessmentRubric,
	triggers: parseTriggers,
	listStyles: parseListStyles,
	chartConfiguration: parseChartConfiguration,
	solution: solAttr => {
		return solAttr.elements[0]
	}
}

let elementsToAttrElements = o => {
	for (let i in o.elements) {
		elementsToAttrElements(o.elements[i])
	}

	if (parsers[o.name]) {
		o.type = 'attribute'
		o.value = parsers[o.name](o)
		delete o.elements
	} else if (o.name && o.name.charAt(0) === o.name.charAt(0).toLowerCase()) {
		o.type = 'attribute'
		o.value = o.elements
		delete o.elements
	}
}

// @TODO: Hack
let __finalPass = o => {
	if (o.type === 'ObojoboDraft.Chunks.Table') {
		o.content.textGroup = {
			textGroup: o.content.textGroup,
			numRows: o.content.numRows,
			numCols: o.content.numCols
		}
		delete o.content.numRows
		delete o.content.numCols
	}

	for (let i in o.children) {
		__finalPass(o.children[i])
	}
}

module.exports = (xml, generateIds = false) => {
	let root = convert.xml2js(xml, {
		compact: false,
		trim: false,
		nativeType: false,
		ignoreComment: true,
		ignoreDeclaration: true
	})
	nameTransform(root)
	extensionTransform(root)
	htmlTransform(root)
	elementsToAttrElements(root)
	attrElementToAttrItem(root)
	draftJsonTransform(root, generateIds)
	__finalPass(root.elements[0])
	// return root;

	return root.elements[0].children[0]
}
