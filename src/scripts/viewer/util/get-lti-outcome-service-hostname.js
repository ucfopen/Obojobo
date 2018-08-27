import parseURL from 'url-parse'

export default function(url) {
	if (!url) return null

	const hostname = parseURL(url, {}).hostname

	if (hostname === '' || !hostname) return 'the external system'
	return hostname
}
