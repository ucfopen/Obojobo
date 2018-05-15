import './inline-nav-button.scss'
import Common from 'Common'

class InlineNavButtonRaw extends React.Component {
	onClick() {
		if (this.props.disabled) {
			return
		}

		switch (this.props.type) {
			case 'prev':
				return this.props.gotoPrev()

			case 'next':
				return this.props.gotoNext()
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

// REDUX STUFF
import { connect } from 'react-redux'
import { gotoPrev, gotoNext } from '../redux/nav-actions'

// Connect to the redux store

const mapDispatchToProps = (dispatch, ownProps) => ({
	gotoPrev: () => {dispatch(gotoPrev())},
	gotoNext: () => {dispatch(gotoNext())}
})

const InlineNavButton = connect(null, mapDispatchToProps)(InlineNavButtonRaw)

export default InlineNavButton
