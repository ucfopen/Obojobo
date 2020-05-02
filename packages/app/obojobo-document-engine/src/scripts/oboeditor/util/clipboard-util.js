import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

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

		ModalUtil.show(<SimpleDialog ok>{'Copied ' + str + ' to the clipboard'}</SimpleDialog>)
	}
}

export default ClipboardUtil
