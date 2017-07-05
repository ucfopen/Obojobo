import './bubble.scss'

export default class Bubble extends React.Component {
	render() {
		return (
			<div className="obojobo-draft--components--modal--bubble">
				<div className="container">
					{this.props.children}
				</div>
			</div>
		)
	}
}
