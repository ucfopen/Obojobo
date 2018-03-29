import './button-bar.scss'

import Button from './button'

export default class ButtonBar extends React.Component {
	static get defaultProps() {
		return {
			selectedIndex: -1,
			onClick: function() {}
		}
	}

	onClickButton(index, isSelected, originalOnClick) {
		if (typeof originalOnClick === 'function') {
			originalOnClick()
		}

		this.props.onClick(index, isSelected)
	}

	render() {
		return (
			<div className={`obojobo-draft--components--button-bar`}>
				{this.props.children.map((child, i) => {
					let isSelected = i === this.props.selectedIndex
					let childProps = Object.assign({}, child.props)

					if (this.props.altAction) {
						childProps.altAction = this.props.altAction
					}

					if (this.props.dangerous) {
						childProps.dangerous = this.props.dangerous
					}

					if (this.props.disabled) {
						childProps.disabled = this.props.disabled
					}

					childProps.onClick = this.onClickButton.bind(this, i, isSelected, childProps.onClick)

					return (
						<div key={i} className={isSelected ? 'is-selected' : ''}>
							<Button {...childProps}>{child.props.children}</Button>
						</div>
					)
				})}
			</div>
		)
	}
}
