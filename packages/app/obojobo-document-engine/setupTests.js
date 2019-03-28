require('obojobo-lib-utils/test-setup-chunks') // setup enzyme
const path = require('path')

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
