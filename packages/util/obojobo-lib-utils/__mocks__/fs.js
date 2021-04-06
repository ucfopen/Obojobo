const fs = jest.genMockFromModule('fs')
const fsActual = jest.requireActual('fs')

const mockReadDirFiles = new Map()
const mockFileContents = new Map()

// mock fs.readdirSync
const readdirSync = dirPath => {
	if (!mockReadDirFiles.has(dirPath)) {
		// console.log(`Mocked FS doesn't have mock dir contents for ${dirPath}, falling back to actual fs`)
		return fsActual.readdirSync(dirPath)
	}
	return mockReadDirFiles.get(dirPath) || []
}

// set mock fs.readdirSync results
function mockReaddirSync(dirPath, arrayOfFileNames = []) {
	mockReadDirFiles.set(dirPath, arrayOfFileNames)
}

// mock fs.readFileSync
const readFileSync = filePath => {
	if (!mockFileContents.has(filePath)) {
		// console.log(`Mocked FS doesn't have mock file contents for ${filePath}, falling back to actual fs`)
		return fsActual.readFileSync(filePath)
	}
	return mockFileContents.get(filePath)
}

// set mock fs.readFileSync results
function __setMockFileContents(filePath, contents) {
	mockFileContents.set(filePath, contents)
}

// clear mock fs.readFileSync results
function __removeMockFileContents(filePath) {
	if (mockFileContents.has(filePath)) {
		mockFileContents.delete(filePath)
	}
}

function existsSync(filePath) {
	return mockFileContents.has(filePath)
}

fs.mockReaddirSync = mockReaddirSync
fs.__setMockFileContents = __setMockFileContents
fs.__removeMockFileContents = __removeMockFileContents
fs.readdirSync = readdirSync
fs.readFileSync = readFileSync
fs.existsSync = existsSync
fs.promises = {}

module.exports = fs
