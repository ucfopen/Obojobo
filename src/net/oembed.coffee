module.exports = (url, callback) ->
	request = new XMLHttpRequest()

	request.addEventListener 'load', (event) ->
		callback JSON.parse(request.responseText)

	request.open 'GET', "http://192.168.99.100/oembed?url=#{url}", true
	request.send()