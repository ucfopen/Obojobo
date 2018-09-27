const TIMEOUT_RESTORE_TAB_INDEX_MS = 1000

export default el => {
	if (!el || !el.focus || !el.getAttribute || !el.setAttribute) return false

	const tabIndex = el.getAttribute('tabindex')

	// VoiceOver requires tabindex of 0 to read the element
	el.setAttribute('tabindex', '0')

	// el.blur()
	el.focus()

	setTimeout(() => {
		el.setAttribute('tabindex', tabIndex)
	}, TIMEOUT_RESTORE_TAB_INDEX_MS)

	return true
}
