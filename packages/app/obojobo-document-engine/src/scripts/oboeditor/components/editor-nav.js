import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import EditorUtil from '../util/editor-util'
import ClipboardUtil from '../util/clipboard-util'
import SubMenu from './sub-menu'
import generateId from '../generate-ids'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import './editor-nav.scss'
// relies on styles from viewer
import '../../viewer/components/nav.scss'

import pageTemplate from '../documents/new-page.json'
import assessmentTemplate from '../documents/new-assessment.json'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util
const { Button } = Common.components

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState
	}

	onClick(item) {
		EditorUtil.gotoPath(item.fullPath)
		this.setState({ navTargetId: item.id })
	}

	renderLabel(label) {
		return <span>{label}</span>
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	render() {
		const className =
			'visual-editor--draft-nav ' +
			isOrNot(this.state.locked, 'locked') +
			isOrNot(this.state.open, 'open') +
			isOrNot(!this.state.disabled, 'enabled')

		const list = EditorUtil.getOrderedList(this.props.navState)

		return (
			<div className={className}>
				<ul>
					{list.map((item, index) => {
						if (item.type === 'heading') return this.renderHeading(index, item)
						if (item.type === 'link') {
							return (
								<SubMenu
									key={index}
									index={index}
									isSelected={this.state.navTargetId === item.id}
									list={list}
									onClick={this.onClick.bind(this, item)}
								/>
							)
						}
						return null
					})}
				</ul>
			</div>
		)
	}
}

export default EditorNav
