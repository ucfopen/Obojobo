import React, { useEffect, useRef, useMemo } from 'react'
import Dialog from 'obojobo-document-engine/src/scripts/common/components/modal/dialog'

const MateriaPickerDialog = ({onPick, onCancel}) => {
	const pickerIframe = useRef(null)

	useEffect(
		() => {
			if(pickerIframe.current.addEventListener){
				window.addEventListener('message', onPick)
			}

		}, [pickerIframe.current]
	)

	const buttons = useMemo(
		() => ([
			{
				value: 'Cancel',
				altAction: true,
				onClick: onCancel
			}
		]), []
	)

	return (
		<Dialog buttons={buttons} title="Choose a Widget">
			<iframe
				ref={pickerIframe}
				id="materia-lti-picker"
				src="/materia-lti-picker-launch"
				frameBorder="0"
				loading="lazy"></iframe>
		</Dialog>
	)
}

export default MateriaPickerDialog
