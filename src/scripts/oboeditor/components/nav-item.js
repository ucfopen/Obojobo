import React from 'react'
import Common from 'Common'

const { OboModel } = Common.models

class NavItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			focused: false
		}
	}

	renderLabel(label) {
		return label
	}

	renderLinkButton(label) {
		return <button>{this.renderLabel(label)}</button>
	}

	renderDropDown(item) {
		const model = OboModel.models[item.id]
		return (
			<div className={'dropdown'}>
				<span className={'drop-arrow'}>▼</span>
				<div className={'drop-content '+ isOrNot(this.state.focused, 'focused')}>
					{ model.isFirst() ? null :
						<button
							onClick={() => this.movePage(item.id, model.getIndex()-1)}>
							Move Up
						</button>
					}
					{ model.isLast() ? null :
						<button
							onClick={() => this.movePage(item.id, model.getIndex()+1)}>
							Move Down
						</button>
					}
					<button onClick={() => this.renamePage(item.id)}>Edit Name</button>
					<button onClick={() => this.deletePage(item.id)}>Delete</button>
					<button>{'Id: '+ item.id}</button>
				</div>
			</div>
		)
	}

	focusLink(item) {
		this.setState({ focused: true })
	}

	blurLink(item) {
		this.setState({ focused: false })
	}

	render() {
		let item = this.props.list[this.props.index]
		let isFirstInList = !this.props.list[this.props.index - 1]
		let isLastInList = !this.props.list[this.props.index + 1]

		let className =
			'link' +
			isOrNot(this.props.isSelected, 'selected') +
			isOrNot(item.flags.assessment, 'assessment') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		return (
			<li
				onClick={() => this.props.onClick(item)}
				className={className}
				onFocus={() => this.focusLink(item)}
				onBlur={() => this.blurLink(item)}
				aria-haspopup="true"
                aria-expanded={this.state.focused}>
				{this.renderLinkButton(item.label)}
				{this.renderDropDown(item)}
			</li>
		)
	}
}

const isOrNot = (item, text) => {
	if(item) return ' is-'+text
	return ' is-not-'+text
}

export default NavItem
