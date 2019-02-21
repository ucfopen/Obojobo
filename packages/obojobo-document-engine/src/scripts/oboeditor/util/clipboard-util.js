/* eslint no-alert: 0 */
const ClipboardUtil = {
	copyToClipboard(str) {
		// Loads the url into an invisible textarea
		// to copy it to the clipboard
		const el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
		window.alert('Copied ' + str + ' to the clipboard')
	}
}

export default ClipboardUtil
