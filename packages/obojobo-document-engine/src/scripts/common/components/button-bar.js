import './button-bar.scss'

import React from 'react'

import Button from './button'

const onClickButton = (index, isSelected, originalOnClick, buttonBarOnClick = () => {}) => {
	if (typeof originalOnClick === 'function') {
		originalOnClick()
	}

	buttonBarOnClick(index, isSelected)
}

const ButtonBar = props => (
	<div className={`obojobo-draft--components--button-bar`}>
		{props.children.map((child, i) => {
			const isSelected = i === props.selectedIndex
			const childProps = Object.assign({}, child.props)

			if (props.altAction) {
				childProps.altAction = props.altAction
			}

			if (props.isDangerous) {
				childProps.isDangerous = props.isDangerous
			}

			if (props.disabled) {
				childProps.disabled = props.disabled
			}

			childProps.onClick = onClickButton.bind(
				null,
				i,
				isSelected,
				childProps.onClick || (() => {}),
				props.onClick
			)

			return (
				<div key={i} className={isSelected ? 'is-selected' : ''}>
					<Button {...childProps}>{child.props.children}</Button>
				</div>
			)
		})}
	</div>
)

export default ButtonBar
