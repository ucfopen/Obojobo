import './viewer-component.scss'

import IFrame from 'obojobo-chunks-iframe/viewer-component'
import React from 'react'
import ReactDOM from 'react-dom'

export default class Materia extends React.Component {
	constructor(props) {
		super(props)
		this.onPostMessageFromMateria = this.onPostMessageFromMateria.bind(this)

		const model = props.model.clone()
		model.modelState.src = this.createSrc(model.modelState.src)

		this.state = {
			unverifiedScore: false,
			model: model
		}
	}

	onPostMessageFromMateria(event){
		console.log(event)
		if(!this.state.model.modelState.src.includes(event.origin)){
			console.log('EVENT NOT FROM IFRAME HOST')
			return
		}

		try{
			const data = JSON.parse(event.data)
			if(data.type === 'materiaScoreRecorded'){
				console.log(`SCORE IS ${data.score} !!!!!`)
				this.setState({unverifiedScore: data.score})
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

	createSrc(src) {
		return `${window.location.origin}/materia-lti-launch?endpoint=${encodeURI(src)}`
	}

	render() {
		return (
			<IFrame
				model={this.state.model}
				moduleData={this.props.moduleData}
			/>
		)
	}
}
