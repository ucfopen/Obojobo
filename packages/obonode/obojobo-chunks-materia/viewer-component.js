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

		let iframeSrc = this.srcToLTILaunchUrl(props.moduleData.navState.visitId, props.model.id)
		if (props.mode === 'review') {
			iframeSrc = props.response.scoreUrl
		}

		// manipulate iframe settings
		const model = props.model.clone()
		model.modelState = {
			...model.modelState,
			src: iframeSrc,
			border: true,
			fit: 'scale',
			initialZoom: 1,
			controls: [IFrameControlTypes.RELOAD],
			sizing: IFrameSizingTypes.FIXED
		}

		// state setup
		this.state = {
			model,
			visitId: props.moduleData.navState.visitId,
			nodeId: props.model.id,
			open: false
		}

		// function binding
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)
		this.onShow = this.onShow.bind(this)
	}

	onPostMessageFromMateria(event) {
		// no callback registered to do anything with a score event
		if (!this.props.handleScorePassback) {
			return
		}

		// iframe isn't present
		if (!this.iframeRef || !this.iframeRef.current || !this.iframeRef.current.refs.iframe) {
			return
		}
		// OR postmessage didn't come from the iframe we're listening to
		if (event.source !== this.iframeRef.current.refs.iframe.contentWindow) {
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
					this.props.handleScorePassback(event, data)
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

	renderCaptionAndScore() {
		let textCaptionRender = null

		let scoreRender = null
		if (this.props.score && this.props.verifiedScore) {
			scoreRender = (
				<span className={'materia-score verified'}>Your highest score: {this.props.score}%</span>
			)
		}

		if (this.state.model.modelState.textGroup.first.text) {
			textCaptionRender = (
				<div className="label">
					<TextGroupEl
						parentModel={this.state.model}
						textItem={this.state.model.modelState.textGroup.first}
						groupIndex="0"
					/>
					{scoreRender}
				</div>
			)
		}

		return textCaptionRender
	}

	renderTextCaption() {
		try {
			return this.renderCaptionAndScore()
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
				{this.renderTextCaption()}
			</div>
		)
	}
}
