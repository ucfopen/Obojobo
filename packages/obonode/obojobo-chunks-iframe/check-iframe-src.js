const isIframeLoadedCorrectly = urlOrEmbedCode => {
	urlOrEmbedCode = urlOrEmbedCode.trim()

	// Try to parse as embed code and find the URL
	const div = document.createElement('div')
	div.innerHTML = urlOrEmbedCode
	if (div.children[0] && div.children[0].tagName.toLowerCase() === 'iframe') {
		urlOrEmbedCode = div.children[0].getAttribute('src')
	}

	// Ensure the URL is prefixed correctly with the protocol, otherwise new URL(...) will fail
	if (urlOrEmbedCode.indexOf('www.') === 0) {
		urlOrEmbedCode = document.location.protocol + '//' + urlOrEmbedCode
	} else if (urlOrEmbedCode.indexOf('//') === 0) {
		urlOrEmbedCode = document.location.protocol + urlOrEmbedCode
	}

	// Try to parse as a URL
	try {
		return new URL(urlOrEmbedCode)
	} catch (e) {
		// Invalid embed code or url.
		return false
	}
}

export { isIframeLoadedCorrectly }
