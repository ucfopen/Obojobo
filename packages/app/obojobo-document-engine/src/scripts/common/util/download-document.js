const API = require('../../viewer/util/api')
const download = require('downloadjs')

const downloadDocument = (draftId, format = 'json', contentId = null) => {
	const url = `/api/drafts/${draftId}/full` + (contentId ? `?contentId=${contentId}` : '')
	if (format === 'json') {
		return (
			API.get(url, 'json')
				.then(res => res.json())
				// pull document out of json.value
				.then(json => JSON.stringify(json.value, null, 2))
				.then(contents => {
					download(contents, `obojobo-draft-${draftId}.json`, 'application/json')
				})
		)
	}

	return API.get(url, 'xml')
		.then(res => res.text())
		.then(contents => {
			download(contents, `obojobo-draft-${draftId}.xml`, 'application/xml')
		})
}

module.exports = {
	downloadDocument
}
