import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Common.components
const { Dispatcher } = Common.flux
const { NavUtil } = Viewer.util
const { FocusUtil } = Common.util

class Module extends React.Component {
	componentWillReceiveProps(nextProps) {
		// If the nav target has changed (and no component has focus) re-focus on the content
		if (
			!FocusUtil.getFocussedComponent(this.props.moduleData.focusState) &&
			nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId
		) {
			Dispatcher.trigger('viewer:focusOnContent')
		}
	}

	componentDidUpdate() {
		// If no component is focussed then abort
		const c = FocusUtil.getFocussedComponent(this.props.moduleData.focusState)
		if (!c) return

		// Else, focus on the DOM element (since the element may not have been visible when
		// the component was focused) if it is on the page and either it doesn't currently have
		// focus or an element inside of it has focus

		const el = c.getDomEl()
		if (document.body.contains(el) && !el.contains(document.activeElement)) {
			el.focus()
		}
	}

	render() {
		let childEl = null
		const navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState)

		if (navTargetModel && navTargetModel.getComponentClass) {
			const ChildComponent = navTargetModel.getComponentClass()
			childEl = <ChildComponent model={navTargetModel} moduleData={this.props.moduleData} />
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className="obojobo-draft--modules--module"
				role="main"
			>
				<div>{childEl}</div>
			</OboComponent>
		)
	}
}

export default Module
