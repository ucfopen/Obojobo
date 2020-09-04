import './modal-container.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { useEffect } from 'react'

import isOrNot from '../util/isornot'

const PORTAL_CONTAINER_DOM_ID = 'obojobo-draft--components--modal-container--content'

class ModalContainer extends React.Component {
	constructor() {
		super()
		this.onMutation = this.onMutation.bind(this)
		this.onRefChanged = this.onRefChanged.bind(this)

		this.state = {
			numPortalElements: 0
		}
	}

	onMutation() {
		const el = ReactDOM.findDOMNode(document.getElementById(ModalContainer.PORTAL_CONTAINER_DOM_ID))

		this.setState({
			numPortalElements: el.children.length
		})
	}

	watchForPortalContainerMutations() {
		if (!this.observer) {
			this.observer = new MutationObserver(this.onMutation)
		}

		this.observer.disconnect()

		this.observer.observe(
			ReactDOM.findDOMNode(document.getElementById(ModalContainer.PORTAL_CONTAINER_DOM_ID)),
			{
				childList: true
			}
		)
	}

	componentDidMount() {
		this.watchForPortalContainerMutations()
	}

	onRefChanged() {
		this.watchForPortalContainerMutations()
	}

	render() {
		return (
			<div
				className={
					'obojobo-draft--components--modal-container' +
					isOrNot(
						(this.props.modalItem && this.props.modalItem.component) ||
							this.state.numPortalElements > 0,
						'active'
					)
				}
			>
				<div className="content legacy">
					{this.props.modalItem && this.props.modalItem.component
						? this.props.modalItem.component
						: null}
				</div>
				<div className="content portal" id={PORTAL_CONTAINER_DOM_ID} ref={this.onRefChanged}></div>
			</div>
		)
	}
}

ModalContainer.PORTAL_CONTAINER_DOM_ID = PORTAL_CONTAINER_DOM_ID

export default ModalContainer
