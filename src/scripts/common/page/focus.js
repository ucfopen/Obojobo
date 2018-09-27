// This is mostly for VoiceOver. Sets the tabindex of an element to 0 temporarily
// and calls focus. This makes it more likely for VoiceOver to read

const TIMEOUT_RESTORE_TAB_INDEX_MS = 1000

export default el => {
	if (!el || !el.focus || !el.getAttribute || !el.setAttribute) return false

	const tabIndex = el.getAttribute('tabindex')

	// VoiceOver requires tabindex of 0 to read the element
	el.setAttribute('tabindex', '0')

	el.focus()

	setTimeout(() => {
		el.setAttribute('tabindex', tabIndex)
	}, TIMEOUT_RESTORE_TAB_INDEX_MS)

	return true
}
