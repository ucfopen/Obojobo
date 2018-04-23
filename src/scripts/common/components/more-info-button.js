import './more-info-button.scss'

const DEFAULT_LABEL = '?'

export default class MoreInfoButton extends React.Component {
	static get defaultProps() {
		return {
			label: DEFAULT_LABEL
		}
	}

	constructor() {
		super()

		this.boundOnMouseOver = this.onMouseOver.bind(this)
		this.boundOnMouseOut = this.onMouseOut.bind(this)
		this.boundOnClick = this.onClick.bind(this)

		this.state = {
			mode: 'hidden'
		}
	}

	onMouseOver() {
		if (this.state.mode === 'hidden') {
			this.setState({ mode: 'hover' })
		}
	}

	onMouseOut() {
		if (this.state.mode === 'hover') {
			this.setState({ mode: 'hidden' })
		}
	}

	onClick() {
		if (this.state.mode === 'clicked') {
			this.setState({ mode: 'hidden' })
		} else {
			this.setState({ mode: 'clicked' })
		}
	}

	render() {
		let isShowing = this.state.mode === 'hover' || this.state.mode === 'clicked'

		return (
			<div
				className={`obojobo-draft--components--more-info-button ${
					this.props.label === DEFAULT_LABEL ? 'is-default-label' : 'is-not-default-label'
				} is-mode-${this.state.mode}`}
			>
				<button
					onMouseOver={this.boundOnMouseOver}
					onMouseOut={this.boundOnMouseOut}
					onClick={this.boundOnClick}
				>
					{this.props.label}
				</button>
				{isShowing ? (
					<div className="info">
						<div className="container">{this.props.children}</div>
					</div>
				) : null}
			</div>
		)
	}
}
