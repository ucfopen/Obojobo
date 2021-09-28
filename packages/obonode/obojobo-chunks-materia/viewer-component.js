import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import TextGroupEl from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el'
import API from 'obojobo-document-engine/src/scripts/viewer/util/api'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'

import Viewer from 'obojobo-document-engine/src/scripts/viewer'
const { NavUtil } = Viewer.util

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
			// autoload: props.mode === 'review', // could be annoying either way, maybe better overall if not automatic
			controls: [IFrameControlTypes.RELOAD],
			sizing: IFrameSizingTypes.FIXED
		}

		// state setup
		this.state = {
			model,
			visitId: props.moduleData.navState.visitId,
			nodeId: props.model.id,
			score: null,
			verifiedScore: false,
			open: false
		}

		// function binding
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)
		this.onShow = this.onShow.bind(this)
	}

	static isResponseEmpty(response) {
		return !response.verifiedScore
	}

	onPostMessageFromMateria(event) {
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
					// this should probably be abstracted in a util function somewhere
					API.get(
						`/materia-lti-score-verify?visitId=${this.state.visitId}&nodeId=${this.state.nodeId}`,
						'json'
					)
						.then(API.processJsonResults)
						.then(result => {
							const newState = {
								score: result.score,
								verifiedScore: true
							}
							this.setState({
								...this.state,
								...newState
							})

							const modelId = this.props.questionModel.get('id')
							const moduleContext = NavUtil.getContext(this.props.moduleData.navState)

							QuestionUtil.setResponse(
								modelId,
								{
									...newState,
									scoreUrl: data.score_url
								},
								null,
								moduleContext,
								moduleContext.split(':')[1],
								moduleContext.split(':')[2],
								false
							)
						})
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
		let textCaptionRender = null

		let scoreRender = null
		if (this.state.score && this.state.verifiedScore) {
			scoreRender = (
				<span className={'materia-score verified'}>Your highest score: {this.state.score}%</span>
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

	renderCaptionOrScore() {
		try {
			return this.renderTextCaption()
		} catch (e) {
			console.error('Error building Materia Caption') // eslint-disable-line no-console
			return null
		}
	}

	getInstructions() {
		return (
			<React.Fragment>
				<span className="for-screen-reader-only">Embedded Materia widget.</span>
				Play the embedded Materia widget to receive a score. Your highest score will be saved.
			</React.Fragment>
		)
	}

	calculateScore() {
		if (!this.props.score) {
			return null
		}

		return {
			score: this.props.score,
			details: null
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
