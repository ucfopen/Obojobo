import './viewer-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import MateriaProperties from './iframe-properties-modal'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class MateriaEditor extends React.Component {
	constructor(props) {
		super(props)
	}

	showPropertiesModal() {
		ModalUtil.show(
			<MateriaProperties
				content={this.props.node.data.get('content')}
				onConfirm={this.changeProperties.bind(this)}
			/>
		)
	}

	changeProperties(content) {
		const editor = this.props.editor

		return editor.setNodeByKey(this.props.node.key, {
			data: {
				content
			}
		})
	}

	getTitle(src, title) {
		if (src === null) {
			return 'Materia missing src attribute'
		} else if (title) {
			return title
		}

		return src.replace(/^https?:\/\//, '')
	}

	render() {
		const content = this.props.node.data.get('content')

		const previewStyle = {
			height: (content.height || '500') + 'px'
		}

		const className =
			'obojobo-draft--chunks--iframe viewer pad is-previewing ' +
			isOrNot(content.border, 'bordered') +
			' is-not-showing ' +
			' is-controls-enabled ' +
			isOrNot(!content.src, 'missing-src') +
			isOrNot(content.initialZoom > 1, 'scaled-up')

		return (
			<div className={className}>
				<div className={'editor-container'} style={previewStyle}>
					<div className="iframe-toolbar">
						<span className="title" aria-hidden>
							{this.getTitle(content.src || null, content.title)}
						</span>
						<Button
							className="properties-button"
							onClick={this.showPropertiesModal.bind(this)}
						>
							Mateira Properties
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default MateriaEditor
