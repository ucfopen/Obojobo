// This is mostly for VoiceOver. Sets the tabindex of an element to 0 temporarily
// and calls focus. This makes it more likely for VoiceOver to read

const TIMEOUT_RESTORE_TAB_INDEX_MS = 1000

export default (el, scroll = true) => {
	const isElement = el && el.focus && el.getAttribute && el.setAttribute
	// in case we get a ref with current containing the dom element
	const isRefWithCurrent =
		el && el.current && el.current.focus && el.current.getAttribute && el.current.setAttribute

	if (!isElement && !isRefWithCurrent) return false

	const element = isElement ? el : el.current

	const tabIndex = element.getAttribute('tabindex')

	// VoiceOver requires tabindex of 0 to read the element
	element.setAttribute('tabindex', '0')

	element.focus({ preventScroll: !scroll })

	setTimeout(() => {
		element.setAttribute('tabindex', tabIndex)
	}, TIMEOUT_RESTORE_TAB_INDEX_MS)

	return true
}
