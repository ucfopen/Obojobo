import React from 'react'

import API from 'obojobo-document-engine/src/scripts/viewer/util/api'

import Viewer from 'obojobo-document-engine/src/scripts/viewer'
const { OboQuestionAssessmentComponent } = Viewer.components

import Materia from 'obojobo-chunks-materia/viewer-component'

import './viewer-component.scss'

export default class MateriaAssessment extends OboQuestionAssessmentComponent {
	constructor(props) {
		super(props)

		this.handleScorePassback = this.handleScorePassback.bind(this)

		this.inputRef = React.createRef()

		this.state = {
			score: null,
			verifiedScore: null,
			scoreUrl: null
		}
	}

	static isResponseEmpty(response) {
		return !response.verifiedScore
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
		if (!this.state.score) {
			return null
		}

		return {
			score: this.state.score,
			details: {
				scoreUrl: this.state.scoreUrl
			}
		}
	}

	handleScorePassback(event, data) {
		// this should probably be abstracted in a util function somewhere
		return API.get(
			`/materia-lti-score-verify?visitId=${this.props.moduleData.navState.visitId}&nodeId=${this.props.model.id}`,
			'json'
		)
			.then(API.processJsonResults)
			.then(result => {
				this.setState({
					score: result.score,
					verifiedScore: true,
					scoreUrl: data.score_url
				})

				this.props.onSaveAnswer(null)
			})
	}

	handleFormChange() {
		return {
			state: this.state,
			targetId: null,
			sendResponseImmediately: true
		}
	}


	render() {
		return (
			<Materia
				{...this.props}
				score={this.state.score}
				verifiedScore={this.state.verifiedScore}
				handleScorePassback = {this.handleScorePassback}
			/>
		)
	}
}