import React from 'react'

import DropDownMenu from './drop-down-menu'

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

class ViewMenu extends React.PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		const previewURL = window.location.origin + '/preview/' + this.props.draftId
		const menu = [
			{
				name: 'Edit With...',
				type: 'sub-menu',
				menu: [
					{
						name: 'JSON Editor',
						type: 'action',
						action: () => {
							this.props.onSave(this.props.draftId)
							this.props.switchMode(JSON_MODE)
						}
					},
					{
						name: 'XML Editor',
						type: 'action',
						action: () => {
							this.props.onSave(this.props.draftId)
							this.props.switchMode(XML_MODE)
						}
					},
					{
						name: 'Visual Editor',
						type: 'action',
						action: () => {
							this.props.onSave(this.props.draftId)
							this.props.switchMode(VISUAL_MODE)
						}
					}
				]
			},
			{
				name: 'Preview Module',
				type: 'action',
				action: () => window.open(previewURL, '_blank')
			},
		]

		return (
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu name="View" menu={menu} />
			</div>
		)
	}
}

export default ViewMenu
