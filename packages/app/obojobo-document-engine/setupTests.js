require('obojobo-lib-utils/test-setup-chunks') // setup enzyme

// Hack to get LaTeX to not warn about quirks mode:
document.write(
	'<!DOCTYPE html><body><div id="viewer-app"></div><div id="viewer-app-loading"></div></body>'
)

// Externals:
window.React = require('react')
window.ReactDOM = require('react-dom')
window._ = require('underscore')
window.Backbone = require('backbone')
window.katex = require('katex')
window.focus = () => ({})
window.matchMedia = jest.fn().mockImplementation(query => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}))

jest.mock('fs')

let isDocumentHidden = document.hidden
Object.defineProperty(document, 'hidden', {
	get() {
		return isDocumentHidden
	},
	set(isHidden) {
		isDocumentHidden = isHidden
	}
})

class XMLSerializer {
	serializeToString() {
		return '<mockSerializedToString/>'
	}
}

global.XMLSerializer = XMLSerializer

global.flushPromises = () => {
	return new Promise(resolve => setImmediate(resolve));
}

process.on('unhandledRejection', (reason, p) => {
	// eslint-disable-next-line no-console
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
