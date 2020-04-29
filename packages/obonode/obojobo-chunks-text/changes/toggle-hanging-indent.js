import toggle from '../util/toggle-hanging-indent'

const toggleHangingIndent = (entry, editor, event) => {
	event.preventDefault()
	toggle(entry, editor)
	return true
}

export default toggleHangingIndent
