import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import TextGroupEl from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el'

import './viewer-component.scss'

export default class Materia extends React.Component {
	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()

		// manipulate iframe settings
		const model = props.model.clone()
		model.modelState.src = this.srcToLTILaunchUrl(model.modelState.src)
		model.modelState.border = true;
		model.modelState.fit = 'scale';
		model.modelState.initialZoom = 1;

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

	onPostMessageFromMateria(event){
		// iframe isn't present OR
		// postmessage didn't come from the iframe we're listening to
		if(!this.iframeRef.current || event.source !== this.iframeRef.current.contentWindow) return

		// postmessage isn't expected domain
		if(!this.state.model.modelState.src.includes(event.origin)) return

		try{
			if(typeof event.data !== 'string') return
			const data = JSON.parse(event.data)
			if(data.type === 'materiaScoreRecorded'){

				console.log('POSTMESSAGE FROM MATERIA')
				console.log(`SCORE IS ${data.score} !!!!!`)
				this.setState({score: data.score})
			}
			else{
				console.log(data)
			}
		} catch(e){
			console.log(e)
		}
	}

	componentDidMount() {
		window.addEventListener("message", this.onPostMessageFromMateria, false)
	}

	componentWillUnmount() {
		window.removeEventListener("message", this.onPostMessageFromMateria, false)
	}

	srcToLTILaunchUrl(src) {
		const visitId = this.props.moduleData.navState.visitId
		const nodeId = this.props.model.id
		return `${window.location.origin}/materia-lti-launch?visitId=${visitId}&nodeId=${nodeId}`
	}

	onShow(){
		this.setState({open: true})
	}

	renderTextCaption(){
		return this.state.model.modelState.textGroup.first.text
			? <div className="label">
					<TextGroupEl
						parentModel={this.state.model}
						textItem={this.state.model.modelState.textGroup.first}
						groupIndex="0"
					/>
				</div>
			: null
	}

	renderCaptionOrScore(){
		try {
			return this.renderTextCaption()
		} catch(e){
			console.error('Error bulding Materia Caption')
			return null
		}
	}

	render() {
		return (
			<div className={`obojobo-draft--chunks--materia ${isOrNot(this.state.open, 'open')}`} >
				<IFrame
					ref={this.iframeRef}
					model={this.state.model}
					moduleData={this.props.moduleData}
					label={`Start ${this.state.model.modelState.widgetEngine || 'Widget'}`}
					onShow={this.onShow}
				/>
				{this.renderCaptionOrScore()}
			</div>
		)
	}
}
