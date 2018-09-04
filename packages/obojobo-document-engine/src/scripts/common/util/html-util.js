const sanitize = function(node) {
	if (node.nodeType === Node.ELEMENT_NODE) {
		if (node.tagName.toLowerCase() === 'script') {
			node = node.parentElement.replaceChild(document.createElement('span'), node)
		}

		for (const attr of Array.from(node.attributes)) {
			switch (attr.name) {
				case 'href':
				case 'cite':
				case 'style':
					true //do nothing
					break

				default:
					node.setAttribute(attr.name, '')
			}
		}

		for (const child of Array.from(node.childNodes)) {
			sanitize(child)
		}
	}

	return node
}

const isElementInline = function(el) {
	switch (el.tagName.toLowerCase()) {
		case 'b':
		case 'big':
		case 'i':
		case 'small':
		case 'tt':
		case 'abbr':
		case 'acronym':
		case 'cite':
		case 'code':
		case 'dfn':
		case 'em':
		case 'kbd':
		case 'strong':
		case 'samp':
		case 'time':
		case 'var':
		case 'a':
		case 'bdo':
		case 'br':
		case 'img':
		case 'map':
		case 'object':
		case 'q':
		case 'script':
		case 'span':
		case 'sub':
		case 'sup':
		case 'button':
		case 'input':
		case 'label':
		case 'select':
		case 'textarea':
			return true
		default:
			return false
	}
}

export { sanitize, isElementInline }
