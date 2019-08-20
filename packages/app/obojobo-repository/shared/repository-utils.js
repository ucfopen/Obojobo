
const urlForEditor = (editor, draftId) => {
	if(editor === 'visual') return `/editor/${draftId}`
	return `/editor#id:${draftId}`
}

const downloadDocument = (draftId, format = 'json') => {
	if (format === 'json') {
		fetch(`/api/drafts/${draftId}/full`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(json => JSON.stringify(json.value, null, 2))
			.then(contents => {
				// use downloadjs to locally build a file to download
				// eslint-disable-next-line no-undef
				download(contents, `obojobo-draft-${draftId}.json`, 'application/json')
			})
	} else {
		fetch(`/api/drafts/${draftId}/full`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/xml',
				'Content-Type': 'application/xml'
			}
		})
			.then(res => res.text())
			.then(contents => {
				// use downloadjs to locally build a file to download
				// eslint-disable-next-line no-undef
				download(contents, `obojobo-draft-${draftId}.xml`, 'application/xml')
			})
	}
}

module.exports = {
	urlForEditor,
	downloadDocument
}
