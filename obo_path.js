const fs = require('fs')
const path = require('path')
const config = require('./config')

const getDraftPath = () => {
	for (let i = 0, len = config.draft.paths.length; i < len; i++) {
		if (fs.existsSync(config.draft.paths[i])) return config.draft.paths[i]
	}

	return null
}

const expandDraftPath = filePathStr => {
	return path.join(__dirname, getDraftPath(), filePathStr)
}

module.exports = {
	expandDraftPath: expandDraftPath,
	getDraftPath: getDraftPath
}
