import Common from 'obojobo-document-engine/src/scripts/common'
import EditorUtil from '../../util/editor-util'
import React from 'react'
import MoreInfoBox from './more-info-box'

const { OboModel } = Common.models

class Header extends React.Component {
	constructor(props) {
		super(props)

		this.saveId = this.saveId.bind(this)
		this.saveContent = this.saveContent.bind(this)
	}

	renamePage(pageId, label) {
		// Fix page titles that are whitespace strings
		if (!/[^\s]/.test(label)) label = null

		EditorUtil.renamePage(pageId, label)
		return label
	}

	renderLabel(label) {
		return <span>{label}</span>
	}

	saveId(oldId, newId) {
		const model = OboModel.models[oldId]

		if (!newId) {
			return 'Please enter an id'
		}

		// prettier-ignore
		if (!model.setId(newId)) {
			return 'The id "' + newId + '" already exists. Please choose a unique id'
		}

		EditorUtil.rebuildMenu(OboModel.getRoot())
	}

	saveContent(oldContent, newContent) {
		const item = this.props.list[this.props.index]
		const model = OboModel.models[item.id]

		model.set({ content: newContent })
		model.triggers = newContent.triggers ? newContent.triggers : []
		model.title =
			newContent.title || model.title ? this.renamePage(item.id, newContent.title) : null

		EditorUtil.setStartPage(newContent.start)
	}

	render() {
		const { index, list } = this.props
		const item = list[index]
		const model = OboModel.models[item.id]

		const contentDescription = [
			{
				name: 'title',
				description: 'Title',
				type: 'input'
			},
			{
				name: 'start',
				description: 'Start Page',
				type: 'select',
				values: list
					.filter(item => item.type === 'link')
					.map(item => ({
						value: item.id,
						description: item.label
					}))
			}
		]

		return (
			<li key={index} className={'heading is-not-selected'}>
				{this.renderLabel(item.label)}
				<MoreInfoBox
					id={item.id}
					type={model.get('type')}
					content={model.get('content')}
					saveId={this.saveId}
					saveContent={this.saveContent}
					savePage={this.props.savePage}
					contentDescription={contentDescription}
					markUnsaved={this.props.markUnsaved}
					hideButtonBar
				/>
			</li>
		)
	}
}

export default Header
