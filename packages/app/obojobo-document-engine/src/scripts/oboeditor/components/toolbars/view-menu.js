import React from 'react'

import DropDownMenu from './drop-down-menu'

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

const openPreview = draftId => {
	const previewURL = window.location.origin + '/preview/' + draftId
	window.open(previewURL, '_blank')
}

const saveAndSwitchMode = ({onSave, switchMode, draftId}, targetMode) => {
	onSave(draftId).then(() => switchMode(targetMode))
}

class ViewMenu extends React.PureComponent {
	render() {
		const menu = [
			{
				name: 'Edit With...',
				type: 'sub-menu',
				menu: [
					{
						name: 'JSON Editor',
						type: 'action',
						action: () => saveAndSwitchMode(this.props, JSON_MODE),
						disabled: this.props.mode === JSON_MODE
					},
					{
						name: 'XML Editor',
						type: 'action',
						action: () => saveAndSwitchMode(this.props, XML_MODE),
						disabled: this.props.mode === XML_MODE
					},
					{
						name: 'Visual Editor',
						type: 'action',
						action: () => saveAndSwitchMode(this.props, VISUAL_MODE),
						disabled: this.props.mode === VISUAL_MODE
					}
				]
			},
			{
				name: 'Preview Module',
				type: 'action',
				action: () => openPreview(this.props.draftId)
			},
			{
				name: 'Show Placeholders',
				type: 'toggle-action',
				action: this.props.togglePlaceholders,
				value: this.props.showPlaceholders
			}
		]

		return (
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu name="View" menu={menu} />
			</div>
		)
	}
}

export default ViewMenu
