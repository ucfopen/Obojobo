import toggle from 'obojobo-chunks-text/util/toggle-hanging-indent'

const toggleHangingIndent = (entry, editor, event) => {
	event.preventDefault()
	toggle(entry, editor)
	return true
}

export default toggleHangingIndent
