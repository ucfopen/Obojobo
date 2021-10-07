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

				// Okay so here's the state of things
				// the line below can be used to grab the form element directly, if that's somehow useful
				// so far it seems like it's possible to dispatch 'change' events to either the input
				//  or the form directly, but neither of those actions triggers the onFormChange handler
				//  that we need to trigger in order for responses to be set correctly
				// const formElement = this.inputRef.current.form

				// ...so instead I've modified QuestionComponent to pass the onFormChange handler down to
				//  assessment components as a prop so they can call it directly, like I'm doing here
				// this feels like it's a hellacious hack, though
				// worse even than just calling QuestionUtil.setResponse directly like I was before
				// so I don't even know what to do at this point
				this.props.onFormChange(null)
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