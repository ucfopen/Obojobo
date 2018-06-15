const path = require('path')
const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-15')
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

// Hack to get LaTeX to not warn about quirks mode:
document.write('<!DOCTYPE html><body><div id="viewer-app"></div><div id="viewer-app-loading"></div></body>')

global.oboRequire = name => require(path.join(__dirname, '__mocks__', name))


window.React = require('react')
window.ReactDOM = require('react-dom')
window._ = require('underscore')
window.Backbone = require('backbone')
window.katex = require('katex')

React.addons = {
	CSSTransitionGroup: require('react-transition-group/CSSTransitionGroup')
}

jest.mock('fs')
let fs = require('fs')
let dbJson = {
	test: {
		host: 'hostVal',
		port: 'portVal',
		database: 'databaseVal',
		user: 'userVal',
		password: 'pwVal'
	},
	development: {
		host: 'itsdev!'
	}
}

// get the actual empty.xml
let realFs = require.requireActual('fs')

fs.__setMockFileContents('./config/db.json', JSON.stringify(dbJson))
fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"jesttestkey":"jesttestsecret"}}}')
fs.__setMockFileContents('./config/draft.json', '{"test":{"paths":[]}}')
fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"canDoThing":["roleName"]}}')
fs.__setMockFileContents(
	'./config/general.json',
	'{"test":{"key":"value","hostname":"obojobo.ucf.edu"}}'
)


let isDocumentHidden = document.hidden
Object.defineProperty(document, 'hidden', {
	get() { return isDocumentHidden },
	set(isHidden) { isDocumentHidden = isHidden }
})
