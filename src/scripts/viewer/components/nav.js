import './nav.scss'

// import navStore from '../../viewer/stores/nav-store'
import NavUtil from '../../viewer/util/nav-util'
import Logo from '../../viewer/components/logo'

import hamburgerImg from 'svg-url-loader?noquotes!./hamburger.svg'
import arrowImg from 'svg-url-loader?noquotes!./arrow.svg'
import lockImg from 'svg-url-loader?noquotes!./lock-icon.svg'

import Common from 'Common'

let { getBackgroundImage } = Common.util
let { OboModel } = Common.models
let { StyleableText } = Common.text
let { StyleableTextComponent } = Common.text

export default class Nav extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			hover: false
		}
	}

	onClick(item) {
		switch (item.type) {
			case 'link':
				if (!NavUtil.canNavigate(this.props.navState)) return
				NavUtil.gotoPath(item.fullPath)
				break

			case 'sub-link':
				let el = OboModel.models[item.id].getDomEl()
				el.scrollIntoView({ behavior: 'smooth', block: 'start' })
				break
		}
	}

	setHoverState(hover) {
		this.setState({ hover })
	}

	renderLabel(label) {
		if (label instanceof StyleableText) {
			return <StyleableTextComponent text={label} />
		}

		return <a>{label}</a>
	}

	renderLink(index, isSelected, item, lockEl) {
		let className = 'link'
		className += isSelected ? ' is-selected' : ' is-not-select'
		className += item.flags.visited ? ' is-visited' : ' is-not-visited'
		className += item.flags.complete ? ' is-complete' : ' is-not-complete'
		className += item.flags.correct ? ' is-correct' : ' is-not-correct'

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
				{lockEl}
			</li>
		)
	}

	renderSubLink(index, isSelected, item, lockEl) {
		let className = 'sub-link'
		className += isSelected ? ' is-selected' : ' is-not-select'
		className += item.flags.correct ? ' is-correct' : ' is-not-correct'

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
				{lockEl}
			</li>
		)
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-select'}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	renderSep(index) {
		return (
			<li key={index} className="seperator">
				<hr />
			</li>
		)
	}

	render() {
		let navState = this.props.navState
		let lockEl
		let isOpenOrHovered = navState.open || this.state.hover
		let bg = getBackgroundImage(isOpenOrHovered ? arrowImg : hamburgerImg)

		if (navState.locked) {
			lockEl = (
				<div className="lock-icon">
					<img src={lockImg} />
				</div>
			)
		}

		let list = NavUtil.getOrderedList(navState)

		let className = 'viewer--components--nav'
		className += navState.locked ? ' is-locked' : ' is-unlocked'
		className += navState.open ? ' is-open' : ' is-closed'
		className += navState.disabled ? ' is-disabled' : ' is-enabled'

		let style = {
			backgroundImage: bg,
			transform: !navState.open && this.state.hover ? 'rotate(180deg)' : '',
			filter: navState.open ? 'invert(100%)' : 'invert(0%)'
		}

		return (
			<div className={className}>
				<button
					className="toggle-button"
					style={style}
					onClick={NavUtil.toggle}
					onMouseOver={this.setHoverState.bind(this, true)}
					onMouseOut={this.setHoverState.bind(this, false)}
				>
					Toggle Navigation Menu
				</button>
				<ul>
					{list.map((item, index) => {
						switch (item.type) {
							case 'heading':
								return this.renderHeading(index, item)

							case 'link':
								return this.renderLink(index, navState.navTargetId === item.id, item, lockEl)

							case 'sub-link':
								return this.renderSubLink(index, navState.navTargetIndex === index, item, lockEl)

							case 'seperator':
								return this.renderSep(index)
						}
					})}
				</ul>
				<Logo inverted />
			</div>
		)
	}
}
