import './dialog.scss'

import Button from '../../../common/components/button'
import DeleteButton from '../../../common/components/delete-button'
import Modal from './modal'

export default class Dialog extends React.Component {
	static get defaultProps() {
		return { centered: true }
	}

	componentDidMount() {
		return (() => {
			let result = []
			for (let index = 0; index < this.props.buttons.length; index++) {
				let button = this.props.buttons[index]
				let item
				if (button.default) {
					item = this.refs[`button${index}`].focus()
				}
				result.push(item)
			}
			return result
		})()
	}

	focusOnFirstElement() {
		return this.refs.button0.focus()
	}

	render() {
		let styles = null
		if (this.props.width) {
			styles = { width: this.props.width }
		}

		return (
			<div className="obojobo-draft--components--modal--dialog" style={styles}>
				<Modal
					onClose={this.props.onClose}
					focusOnFirstElement={this.focusOnFirstElement.bind(this)}
				>
					{this.props.title
						? <h1 className="heading" style={{ textAlign: this.props.centered ? 'center' : null }}>
								{this.props.title}
							</h1>
						: null}
					<div
						className="dialog-content"
						style={{ textAlign: this.props.centered ? 'center' : null }}
					>
						{this.props.children}
					</div>
					<div className="controls">
						{this.props.buttons.map((buttonPropsOrText, index) => {
							if (typeof buttonPropsOrText === 'string') {
								return (
									<span key={index} className="text">
										{buttonPropsOrText}
									</span>
								)
							}
							buttonPropsOrText.key = index
							return <Button ref={`button${index}`} {...buttonPropsOrText} />
						})}
					</div>
				</Modal>
			</div>
		)
	}
}
