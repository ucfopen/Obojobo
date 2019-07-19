const xmlEncode = string => {
	string = string + ''

	return string.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

module.exports = xmlEncode
