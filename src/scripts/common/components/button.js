import './button.scss'

export default class Button extends React.Component {
	static get defaultProps() {
		return {
			value: null,
			disabled: false,
			align: 'center'
		}
	}

	focus() {
		let el = ReactDOM.findDOMNode(this.refs.button)
		if (el) el.focus()
	}

	render() {
		let children
		if (this.props.value) {
			children = this.props.value
		} else {
			;({ children } = this.props)
		}

		return (
			<div
				className={
					'obojobo-draft--components--button' +
					(this.props.dangerous ? ' dangerous' : '') +
					(this.props.altAction ? ' alt-action' : '') +
					` align-${this.props.align}`
				}
			>
				<button
					ref="button"
					onClick={this.props.onClick}
					tabIndex={this.props.shouldPreventTab ? '-1' : this.props.tabIndex}
					disabled={this.props.disabled || this.props.shouldPreventTab}
				>
					{children}
				</button>
			</div>
		)
	}
}
