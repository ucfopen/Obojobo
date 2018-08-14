import './inline-nav-button.scss'

import React from 'react'

import NavUtil from '../../viewer/util/nav-util'

export default class InlineNavButton extends React.Component {
	onClick() {
		if (this.props.disabled) {
			return
		}

		switch (this.props.type) {
			case 'prev':
				return NavUtil.goPrev()

			case 'next':
				return NavUtil.goNext()
		}
	}

	render() {
		return (
			<div
				className={`viewer--components--inline-nav-button is-${this.props.type}${
					this.props.disabled ? ' is-not-enabled' : ' is-enabled'
				}`}
				onClick={this.onClick.bind(this)}
			>
				{this.props.title}
			</div>
		)
	}
}
