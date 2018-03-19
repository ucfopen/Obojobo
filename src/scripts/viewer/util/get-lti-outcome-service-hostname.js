import parseURL from 'url-parse'

export default function(url) {
	let hostname = parseURL(url || '', {}).hostname

	if (hostname === '' || !hostname) return 'the external system'
	return hostname
}
