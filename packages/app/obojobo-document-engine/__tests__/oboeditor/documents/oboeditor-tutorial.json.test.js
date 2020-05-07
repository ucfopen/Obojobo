
// we're going to convert these json files to xml
// so that changes to the document are easier to see for us humans
describe('Document diffs', () => {

	const jsonToEasilyComparedXML = json => {
		const jsonToXml = require('obojobo-document-json-parser/json-to-xml-parser')
		// convert to json
		const xml = jsonToXml(json)
		// replace all the id="xxx" attributes with a single common attribute to make them easy to compare
		return xml.replace(/ id=".+?"/g, " id=\"?\"");
	}

	test('oboeditor-tutorial.json', () => {
		const json = require('src/scripts/oboeditor/documents/oboeditor-tutorial.json')
		expect(jsonToEasilyComparedXML(json)).toMatchSnapshot()
	})

	test('generate-assessment.js', () => {
		const json = require('src/scripts/oboeditor/documents/generate-assessment').default()
		expect(jsonToEasilyComparedXML(json)).toMatchSnapshot()
	})

	test('generate-page.js', () => {
		const json = require('src/scripts/oboeditor/documents/generate-page').default()
		expect(jsonToEasilyComparedXML(json)).toMatchSnapshot()
	})

})
