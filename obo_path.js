let fs = require('fs')
let path = require('path')
let config = require('./config')

let getDraftPath = () => {
	for (let i = 0, len = config.draft.paths.length; i < len; i++) {
		if (fs.existsSync(config.draft.paths[i])) return config.draft.paths[i]
	}

	return null
}

let expandDraftPath = filePathStr => {
	return path.join(__dirname, getDraftPath(), filePathStr)
}

module.exports = {
	expandDraftPath: expandDraftPath,
	getDraftPath: getDraftPath
}
