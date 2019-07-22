import './viewer-component.scss'

import React from 'react'
import { connect } from 'react-redux'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { Button } = Common.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk
const { focus } = Common.page

class ActionButton extends React.Component {
	static focusOnContent(model) {
		focus(model.getDomEl().querySelector('button'))
	}

	onClick(triggers) {
		triggers.forEach(trigger => {
			trigger.actions.forEach(action => {
				this.props[action.type](action.value)
			})
		})
	}

	render() {
		const model = this.props.model
		const textItem = model.modelState.textGroup ? model.modelState.textGroup.first : ''
		return (
			<OboComponent model={model} moduleData={this.props.moduleData}>
				<TextChunk className="obojobo-draft--chunks--action-button pad">
					<Button
						// onClick={model.processTrigger.bind(model, 'onClick')}
						onClick={() => this.onClick(model.triggers)}
						value={model.modelState.label}
						align={model.modelState.align}
						tabIndex="0"
					>
						<TextGroupEl textItem={textItem} groupIndex="0" parentModel={model} />
					</Button>
				</TextChunk>
			</OboComponent>
		)
	}
}

const mapDispatchToProops = dispatch => {
	return {
		'nav:toggle': () => dispatch({ type: 'ON_SET_NAV_ENABLE' }),
		'nav:open': () => dispatch({ type: 'ON_SET_NAV_ENABLE', payload: { value: true } }),
		'nav:close': () => dispatch({ type: 'ON_SET_NAV_ENABLE', payload: { value: false } }),
		'nav:lock': () => dispatch({ type: 'ON_SET_NAV_LOCK', payload: { value: true } }),
		'nav:unlock': () => dispatch({ type: 'ON_SET_NAV_LOCK', payload: { value: false } }),
		'nav:prev': () => dispatch({ type: 'ON_SET_NAV_PREV' }),
		'nav:next': () => dispatch({ type: 'ON_SET_NAV_NEXT' }),
		'nav:goto': value => dispatch({ type: 'ON_SET_NAV_WITH_ID', payload: { id: value.id } }),
		'focus:component': value =>
			dispatch({ type: 'ON_SET_CURR_FOCUS_WITH_ID', payload: { id: value.id } })
	}
}

export default connect(
	null,
	mapDispatchToProops
)(ActionButton)
