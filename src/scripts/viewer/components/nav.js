import './nav.scss'

import navStore from '../../viewer/stores/nav-store'
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
		if (item.type === 'link') {
			if (!NavUtil.canNavigate(this.props.navState)) return
			return NavUtil.gotoPath(item.fullPath)
		} else if (item.type === 'sub-link') {
			let el = OboModel.models[item.id].getDomEl()
			return el.scrollIntoView({ behavior: 'smooth' })
		}
	}

	hideNav() {
		return NavUtil.toggle()
	}

	onMouseOver() {
		return this.setState({ hover: true })
	}

	onMouseOut() {
		return this.setState({ hover: false })
	}

	renderLabel(label) {
		if (label instanceof StyleableText) {
			return <StyleableTextComponent text={label} />
		} else {
			return (
				<a>
					{label}
				</a>
			)
		}
	}

	render() {
		let bg, lockEl
		if (this.props.navState.open || this.state.hover) {
			bg = getBackgroundImage(arrowImg)
		} else {
			bg = getBackgroundImage(hamburgerImg)
		}

		if (this.props.navState.locked) {
			lockEl = (
				<div className="lock-icon">
					<img src={lockImg} />
				</div>
			)
		} else {
			lockEl = null
		}

		let list = NavUtil.getOrderedList(this.props.navState)

		return (
			<div
				className={`viewer--components--nav${this.props.navState.locked
					? ' is-locked'
					: ' is-unlocked'}${this.props.navState.open ? ' is-open' : ' is-closed'}${this.props
					.navState.disabled
					? ' is-disabled'
					: ' is-enabled'}`}
			>
				<button
					className="toggle-button"
					onClick={this.hideNav.bind(this)}
					onMouseOver={this.onMouseOver.bind(this)}
					onMouseOut={this.onMouseOut.bind(this)}
					style={{
						backgroundImage: bg,
						transform: !this.props.navState.open && this.state.hover ? 'rotate(180deg)' : '',
						filter: this.props.navState.open ? 'invert(100%)' : 'invert(0%)'
					}}
				>
					Toggle Navigation Menu
				</button>
				<ul>
					{list.map((item, index) => {
						switch (item.type) {
							case 'heading':
								var isSelected = false
								return (
									<li
										key={index}
										className={`heading${isSelected ? ' is-selected' : ' is-not-select'}`}
									>
										{this.renderLabel(item.label)}
									</li>
								)
								break

							case 'link':
								var isSelected = this.props.navState.navTargetId === item.id
								//var isPrevVisited = this.props.navState.navTargetHistory.indexOf(item.id) > -1
								return (
									<li
										key={index}
										onClick={this.onClick.bind(this, item)}
										className={`link${isSelected ? ' is-selected' : ' is-not-select'}${item.flags
											.visited
											? ' is-visited'
											: ' is-not-visited'}${item.flags.complete
											? ' is-complete'
											: ' is-not-complete'}${item.flags.correct
											? ' is-correct'
											: ' is-not-correct'}`}
									>
										{this.renderLabel(item.label)}
										{lockEl}
									</li>
								)
								break

							case 'sub-link':
								var isSelected = this.props.navState.navTargetIndex === index

								return (
									<li
										key={index}
										onClick={this.onClick.bind(this, item)}
										className={`sub-link${isSelected ? ' is-selected' : ' is-not-select'}${item
											.flags.correct
											? ' is-correct'
											: ' is-not-correct'}`}
									>
										{this.renderLabel(item.label)}
										{lockEl}
									</li>
								)
								break

							case 'seperator':
								return (
									<li key={index} className="seperator">
										<hr />
									</li>
								)
								break
						}
					})}
				</ul>
				<Logo inverted />
			</div>
		)
	}
}
