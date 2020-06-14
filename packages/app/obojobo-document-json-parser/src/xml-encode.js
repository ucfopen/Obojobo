const xmlEncode = str => {
	str = str + ''

	const replacements = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;',
		'"': '&#34;'
	}
	return str.replace(/[&<>'"]/g, match => replacements[match])
}

module.exports = xmlEncode
