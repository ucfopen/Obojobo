'use strict'

const path = require('path')

const fs = jest.genMockFromModule('fs')

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null)
function __setMockFiles(newMockFiles) {
	mockFiles = Object.create(null)
	for (const file in newMockFiles) {
		const dir = path.dirname(file)

		if (!mockFiles[dir]) {
			mockFiles[dir] = []
		}
		mockFiles[dir].push(path.basename(file))
	}
}

let mockFileContents = new Map()
function __setMockFileContents(filePath, contents) {
	mockFileContents.set(filePath, contents)
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
	return mockFiles[directoryPath] || []
}

function readFileSync(filePath) {
	return mockFileContents.get(filePath)
}

function existsSync(filePath) {
	return mockFileContents.has(filePath)
}

fs.__setMockFiles = __setMockFiles
fs.__setMockFileContents = __setMockFileContents
fs.readdirSync = readdirSync
fs.readFileSync = readFileSync
fs.existsSync = existsSync

module.exports = fs
