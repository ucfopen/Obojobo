import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import NumericOption from './numeric-option'
import { fullTextToSimplifed, EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE } from '../constants'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'

const UPDATE_NODE_FROM_STATE_DEBOUNCE_MS = 500

class NumericAnswer extends React.Component {
	constructor(props) {
		super(props)

		// After the content is changed and no typing has happened for 500 ms
		// then we update the slate state from the internal state.
		this.updateNodeFromState = debounce(
			UPDATE_NODE_FROM_STATE_DEBOUNCE_MS,
			this.updateNodeFromState
		)

		// copy the attributes we want into state
		const content = this.props.element.content
		this.state = { ...content }

		this.onHandleInputChange = this.onHandleInputChange.bind(this)
		this.onHandleSelectChange = this.onHandleSelectChange.bind(this)
	}

	updateNodeFromState() {
		try {
			const content = this.props.element.content
			const path = ReactEditor.findPath(this.props.editor, this.props.element)

			Transforms.setNodes(
				this.props.editor,
				{ content: { ...content, ...this.state } },
				{ at: path }
			)

			return true
		} catch (e) {
			return false
		}
	}

	onHandleInputChange(event) {
		event.preventDefault()
		event.stopPropagation()

		const { name, value } = event.target

		this.setState({
			...this.state,
			[name]: value
		})

		this.updateNodeFromState()
	}

	getAnswerFromState(state) {
		if (typeof state.answer !== 'undefined' && state.answer !== null) {
			return state.answer
		}

		if (typeof state.start !== 'undefined' && state.start !== null) {
			return state.start
		}

		return '1'
	}

	getStateForRequirement(requirement) {
		switch (requirement) {
			case MARGIN_OF_ERROR:
				return {
					requirement: fullTextToSimplifed[requirement],
					type: 'percent',
					margin: '0',
					answer: this.getAnswerFromState(this.state),
					start: undefined, //eslint-disable-line no-undefined
					end: undefined //eslint-disable-line no-undefined
				}

			case EXACT_ANSWER:
				return {
					requirement: fullTextToSimplifed[requirement],
					answer: this.getAnswerFromState(this.state),
					type: undefined, //eslint-disable-line no-undefined
					start: undefined, //eslint-disable-line no-undefined
					end: undefined, //eslint-disable-line no-undefined
					margin: undefined //eslint-disable-line no-undefined
				}

			case WITHIN_A_RANGE:
				return {
					requirement: fullTextToSimplifed[requirement],
					start: this.getAnswerFromState(this.state),
					end: this.getAnswerFromState(this.state),
					answer: undefined, //eslint-disable-line no-undefined
					type: undefined, //eslint-disable-line no-undefined
					margin: undefined //eslint-disable-line no-undefined
				}
		}
	}

	onHandleSelectChange(event) {
		event.preventDefault()
		event.stopPropagation()

		const { name, value } = event.target

		switch (name) {
			case 'requirement':
				this.setState(this.getStateForRequirement(value))
				break

			case 'margin-type':
				this.setState({
					type: fullTextToSimplifed[value]
				})
				break
		}

		this.updateNodeFromState()
	}

	render() {
		return (
			<div className="numeric-input-container" contentEditable={false}>
				<NumericOption
					editor={this.props.editor}
					numericChoice={this.state}
					onHandleInputChange={this.onHandleInputChange}
					onHandleSelectChange={this.onHandleSelectChange}
				/>
				{this.props.children}
			</div>
		)
	}
}

export default withSlateWrapper(NumericAnswer)
