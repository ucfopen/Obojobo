export default function(asset) {
	if (!asset || !asset.replace) return ''
	return `url('${asset.replace(/'/g, "\\'")}')`
}
