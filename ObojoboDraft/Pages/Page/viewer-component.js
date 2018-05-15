import './viewer-component.scss'

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components

class PageRaw extends React.Component {
	componentWillReceiveProps(nextProps) {
		// @TODO: redux - move this to where the page is actually changed?
		if(nextProps.navTargetId !== this.props.navTargetId){
			this.props.markPageVisited(this.props.navTargetId)
		}
	}

	render() {
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--pages--page"
			>
				{this.props.model.children.models.map((child, index) => {
					let Component = child.getComponentClass()

					return <Component key={index} model={child} moduleData={this.props.moduleData} />
				})}
			</OboComponent>
		)
	}
}

let { connect } = Viewer.redux
let { setFlag } = Viewer.redux.NavActions

// Connect to the redux store
const mapStateToProps = (state, ownProps) => ({
	navTargetId: state.nav.navTargetId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	markPageVisited: (itemId) => { dispatch(setFlag(itemId, 'visited', true))}
})

const Page = connect(mapStateToProps, mapDispatchToProps)(PageRaw)

export default Page
