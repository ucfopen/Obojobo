const addEl = function(url, el, onLoad = null, onError = null) {
	if (loaded[url]) {
		if (onLoad !== null) {
			onLoad(url)
		}
		return true // return true, meaning the file was loaded
	}

	if (onError !== null) {
		el.onerror = onError
	}
	if (onLoad !== null) {
		el.onload = function() {
			loaded[url] = url
			return onLoad(url)
		}
	}

	document.head.appendChild(el)

	return false // return false, meaning the file wasn't already loaded
}

const loaded = {}

export default {
	add(urlOrUrls, onLoad = null, onError = null) {
		let urls
		let type

		if (typeof urlOrUrls === 'string') {
			urls = [urlOrUrls]
		} else {
			urls = urlOrUrls
		}

		return urls.map(url => {
			type = url.substr(url.lastIndexOf('.') + 1)

			switch (type) {
				case 'js': {
					const script = document.createElement('script')
					script.setAttribute('src', url)
					return addEl(url, script, onLoad, onError)
				}

				case 'css': {
					const link = document.createElement('link')
					link.setAttribute('rel', 'stylesheet')
					link.setAttribute('href', url)
					return addEl(url, link, onLoad, onError)
				}
			}

			return false
		})
	}
}
