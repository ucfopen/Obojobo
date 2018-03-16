import './modal-container.scss'

export default class ModalContainer extends React.Component {
	render() {
		return (
			<div className="obojobo-draft--components--modal-container">
				<div className="content">{this.props.children}</div>
			</div>
		)
	}
}
