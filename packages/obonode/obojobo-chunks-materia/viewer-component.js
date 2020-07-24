import './viewer-component.scss'

import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import ReactDOM from 'react-dom'

export default class Materia extends React.Component {
	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)

		const model = props.model.clone()
		model.modelState.src = this.createLaunchSrc(model.modelState.src)
		model.modelState.border = true;
		model.modelState.fit = 'scale';
		model.modelState.initialZoom = 1;

		this.state = {
			score: null,
			verifiedScore: false,
			model: model
		}
	}

	onPostMessageFromMateria(event){
		// postmessage didn't come from the iframe we're listening to
		if(event.source !== this.iframeRef.current.contentWindow) return

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

	createLaunchSrc(src) {
		return `${window.location.origin}/materia-lti-launch?endpoint=${encodeURI(src)}&isPreview=${this.props.moduleData.isPreviewing}`
	}

	render() {
		return (
			<div className="obojobo-draft--chunks--materia" >
				<IFrame
					ref={this.iframeRef}
					model={this.state.model}
					moduleData={this.props.moduleData}
					label={`Start ${this.state.model.modelState.widgetEngine}`}
				/>
				{this.state.score !== null
					? <div className="materia-score">{`Score: ${this.state.score}`}</div>
					: null
				}
			</div>
		)
	}
}
