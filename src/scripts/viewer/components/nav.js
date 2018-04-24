import './nav.scss'
import NavUtil from '../../viewer/util/nav-util'
import Logo from '../../viewer/components/logo'
import hamburgerImg from 'svg-url-loader?noquotes!./hamburger.svg'
import arrowImg from 'svg-url-loader?noquotes!./arrow.svg'
import lockImg from 'svg-url-loader?noquotes!./lock-icon.svg'
import isOrNot from '../../common/isornot'
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
		let className =
			'link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.visited, 'visited') +
			isOrNot(item.flags.complete, 'complete') +
			isOrNot(item.flags.correct, 'correct')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
				{lockEl}
			</li>
		)
	}

	renderSubLink(index, isSelected, item, lockEl) {
		let className =
			'sub-link' + isOrNot(isSelected, 'selected') + isOrNot(item.flags.correct, 'correct')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
				{lockEl}
			</li>
		)
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
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

	getLockEl(isLocked) {
		if (isLocked) {
			return (
				<div className="lock-icon">
					<img src={lockImg} />
				</div>
			)
		}
	}

	render() {
		let navState = this.props.navState
		let lockEl = this.getLockEl(navState.locked)
		let isOpenOrHovered = navState.open || this.state.hover
		let bg = getBackgroundImage(isOpenOrHovered ? arrowImg : hamburgerImg)

		let list = NavUtil.getOrderedList(navState)

		let className =
			'viewer--components--nav' +
			isOrNot(navState.locked, 'locked') +
			isOrNot(navState.open, 'open') +
			isOrNot(!navState.disabled, 'enabled')

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
