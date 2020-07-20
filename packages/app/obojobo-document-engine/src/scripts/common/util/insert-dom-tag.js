const insertDomTag = (props, type) => {
	const tag = document.createElement(type)
	for (const i in props) {
		tag[i] = props[i]
	}
	const firstTag = document.getElementsByTagName(type)[0]
	firstTag.parentNode.insertBefore(tag, firstTag)
}

export default insertDomTag
