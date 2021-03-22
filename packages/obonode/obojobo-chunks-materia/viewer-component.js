import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import TextGroupEl from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el'

import './viewer-component.scss'
import IFrameControlTypes from 'obojobo-chunks-iframe/iframe-control-types'
import IFrameSizingTypes from 'obojobo-chunks-iframe/iframe-sizing-types'

export default class Materia extends React.Component {
	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()

		// manipulate iframe settings
		const model = props.model.clone()
		model.modelState = {
			...model.modelState,
			src: this.srcToLTILaunchUrl(props.moduleData.navState.visitId, props.model.id),
			border: true,
			fit: 'scale',
			initialZoom: 1,
			controls: [IFrameControlTypes.RELOAD],
			sizing: IFrameSizingTypes.FIXED
		}

		// state setup
		this.state = {
			model,
			score: null,
			verifiedScore: false,
			open: false
		}

		// function binding
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)
		this.onShow = this.onShow.bind(this)
	}

	onPostMessageFromMateria(event) {
		// iframe isn't present OR
		// postmessage didn't come from the iframe we're listening to
		if (!this.iframeRef.current || event.source !== this.iframeRef.current.contentWindow) {
			return
		}

		// postmessage isn't expected domain
		if (!this.state.model.modelState.src.includes(event.origin)) {
			return
		}

		if (typeof event.data !== 'string') {
			return
		}

		try {
			const data = JSON.parse(event.data)

			switch (data.type) {
				case 'materiaScoreRecorded':
					this.setState({ score: data.score })
					break
			}
		} catch (e) {
			console.error(e) // eslint-disable-line no-console
		}
	}

	componentDidMount() {
		window.addEventListener('message', this.onPostMessageFromMateria, false)
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.onPostMessageFromMateria, false)
	}

	srcToLTILaunchUrl(visitId, nodeId) {
		return `${window.location.origin}/materia-lti-launch?visitId=${visitId}&nodeId=${nodeId}`
	}

	onShow() {
		this.setState({ open: true })
	}

	renderTextCaption() {
		return this.state.model.modelState.textGroup.first.text ? (
			<div className="label">
				<TextGroupEl
					parentModel={this.state.model}
					textItem={this.state.model.modelState.textGroup.first}
					groupIndex="0"
				/>
			</div>
		) : null
	}

	renderCaptionOrScore() {
		try {
			return this.renderTextCaption()
		} catch (e) {
			console.error('Error building Materia Caption') // eslint-disable-line no-console
			return null
		}
	}

	render() {
		return (
			<div className={`obojobo-draft--chunks--materia ${isOrNot(this.state.open, 'open')}`}>
				<IFrame
					ref={this.iframeRef}
					model={this.state.model}
					moduleData={this.props.moduleData}
					title={`${this.state.model.modelState.widgetEngine || 'Materia'} Widget`}
					onShow={this.onShow}
				/>
				{this.renderCaptionOrScore()}
			</div>
		)
	}
}
