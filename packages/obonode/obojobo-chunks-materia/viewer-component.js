import './viewer-component.scss'

import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import ReactDOM from 'react-dom'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

export default class Materia extends React.Component {
	constructor(props) {
		super(props)
		this.iframeRef = React.createRef()
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)
		this.onShow = this.onShow.bind(this)

		const model = props.model.clone()
		model.modelState.src = this.createLaunchSrc(model.modelState.src)
		model.modelState.border = true;
		model.modelState.fit = 'scale';
		model.modelState.initialZoom = 1;

		this.state = {
			score: null,
			verifiedScore: false,
			model: model,
			open: false
		}
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

	createLaunchSrc(src) {
		return `${window.location.origin}/materia-lti-launch?endpoint=${encodeURI(src)}&isPreview=${this.props.moduleData.isPreviewing}`
	}

	onShow(){
		this.setState({open: true})
	}

	render() {
		return (
			<div className={`obojobo-draft--chunks--materia ${isOrNot(this.state.open, 'open')}`} >
				<IFrame
					ref={this.iframeRef}
					model={this.state.model}
					moduleData={this.props.moduleData}
					label={`Start ${this.state.model.modelState.widgetEngine}`}
					onShow={this.onShow}
				/>
				{this.state.score !== null
					? <div className="label">{`Score: ${this.state.score}%`}</div>
					: <div className="label">{this.state.model.modelState.title}</div>
				}
			</div>
		)
	}
}
