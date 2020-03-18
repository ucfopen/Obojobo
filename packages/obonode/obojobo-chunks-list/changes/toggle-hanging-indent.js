import toggle from 'obojobo-chunks-text/util/toggle-hanging-indent'

const toggleHangingIndent = (event, editor) => {
	event.preventDefault()
	toggle(editor)
	return true
}

export default toggleHangingIndent
