import './inline-nav-button.scss'

import React from 'react'

import NavUtil from '../../viewer/util/nav-util'

export default class InlineNavButton extends React.Component {
	onClick(event) {
		if (this.props.disabled) {
			return
		}

		if (event && event.target) event.target.blur()

		switch (this.props.type) {
			case 'prev':
				return NavUtil.goPrev()

			case 'next':
				return NavUtil.goNext()
		}
	}

	render() {
		return (
			<button
				className={`viewer--components--inline-nav-button is-${this.props.type}${
					this.props.disabled ? ' is-not-enabled' : ' is-enabled'
				}`}
				onClick={this.onClick.bind(this)}
				disabled={this.props.disabled}
			>
				{this.props.title}
			</button>
		)
	}
}
